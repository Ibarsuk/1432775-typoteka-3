"use strict";

const Aliase = require(`../models/aliase`);
const Sequelize = require(`sequelize`);

class NotesService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
    this._Category = sequelize.models.Category;
    this._Comment = sequelize.models.Comment;
    this._User = sequelize.models.User;
    this._Photo = sequelize.models.Photo;
    this._ArticleCategory = sequelize.models.ArticleCategory;
  }

  async findAll({limit, offset = 0, fromCategoryId}) {
    const options = {
      include: [
        {
          model: this._Photo,
          as: Aliase.PHOTO,
          attributes: [`id`, `name`, `uniqueName`],
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`],
        },
      ],

      attributes: {
        include: [
          [
            Sequelize.literal(
                `(SELECT COUNT(*) FROM comments WHERE "articleId" = "Article"."id")`
            ),
            `commentsNumber`,
          ],
        ],
      },

      offset,
      limit,
      order: [[`createdAt`, `DESC`]],
    };

    if (fromCategoryId) {
      options.include.push({
        required: true,
        model: this._ArticleCategory,
        as: Aliase.ARTICLES_CATEGORIES,
        where: {categoryId: fromCategoryId},
        attributes: [],
      });
    }

    const rows = await this._Article.findAll(options);
    const count = await this._Article.count();

    return {count, rows};
  }

  async findMostCommented({limit}) {
    const options = {
      include: [
        {
          model: this._Photo,
          as: Aliase.PHOTO,
          attributes: [`id`, `name`, `uniqueName`],
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`],
        },
      ],

      attributes: {
        include: [
          [
            Sequelize.literal(
                `(SELECT COUNT(*) FROM comments WHERE "articleId" = "Article"."id")`
            ),
            `commentsNumber`,
          ],
        ],
      },

      limit,
      order: [[Sequelize.col(`commentsNumber`), `ASC`]],
    };

    const res = await this._Article.findAll(options);
    const articlesWithComments = res
      .map((e) => e.get())
      .filter((article) => article.commentsNumber > 0);

    return articlesWithComments;
  }

  async findOne(id) {
    const options = {
      include: [
        {
          model: this._Photo,
          as: Aliase.PHOTO,
          attributes: [`id`, `name`, `uniqueName`],
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`],
        },
        {
          model: this._Comment,
          as: Aliase.COMMENTS,
          include: [
            {
              model: this._User,
              as: Aliase.USER,
              attributes: [`firstName`, `lastName`, `avatar`],
            },
          ],
        },
      ],

      attributes: {
        include: [
          [
            Sequelize.literal(
                `(SELECT COUNT(*) FROM comments WHERE "articleId" = "Article"."id")`
            ),
            `commentsNumber`,
          ],
        ],
      },

      order: [[`createdAt`, `DESC`]],
    };

    return await this._Article.findByPk(id, options);
  }

  async findUserArticles(userId) {
    const options = {
      include: [
        {
          model: this._Photo,
          as: Aliase.PHOTO,
          attributes: [`id`, `name`, `uniqueName`],
        },
        {
          model: this._Category,
          as: Aliase.CATEGORIES,
          attributes: [`id`, `name`],
        },
      ],

      attributes: {
        include: [
          [
            Sequelize.literal(
                `(SELECT COUNT(*) FROM comments WHERE "articleId" = "Article"."id")`
            ),
            `commentsNumber`,
          ],
        ],
      },

      order: [[`createdAt`, `DESC`]],
      where: {
        userId
      }
    };

    return await this._Article.findAll(options);
  }

  async create(userId, article) {
    const validArticle = {...article, userId};
    const createdArtcle = await this._Article.create(validArticle);
    await Promise.all([
      createdArtcle.addCategories(validArticle.categories),
      ...(validArticle.photo
        ? [createdArtcle.createPhoto(validArticle.photo)]
        : []),
    ]);
    return createdArtcle.get();
  }

  async update(id, item) {
    await Promise.all([
      this._Article.update(item, {
        where: {
          id,
        },
      }),

      this._Photo.update(item.photo, {
        where: {
          articleId: id,
        },
      }),

      this._updateArticleCategories(id, item.categories),
    ]);
  }

  async drop(id) {
    return await this._Article.destroy({
      where: {
        id,
      },
    });
  }

  async _updateArticleCategories(articleId, newCategories) {
    const currentCategories = await this._ArticleCategory.findAll({
      attributes: [`categoryId`],
      where: {
        articleId,
      },
      raw: true,
    });
    const currentCategoriesIds = currentCategories.map((e) => e.categoryId);
    const allCategories = new Set([...currentCategoriesIds, ...newCategories]);

    const sortedCategories = {
      deleted: [],
      added: [],
    };

    allCategories.forEach((categoryId) => {
      const isInOldCategories = currentCategoriesIds.includes(categoryId);
      const isInNewCategories = newCategories.includes(categoryId);

      if (!isInOldCategories && isInNewCategories) {
        sortedCategories.added.push(categoryId);
      }
      if (isInOldCategories && !isInNewCategories) {
        sortedCategories.deleted.push(categoryId);
      }
    });

    const isCategoriesAdded = !!sortedCategories.added.length;
    const isCategoriesDeleted = !!sortedCategories.deleted.length;

    if (!isCategoriesAdded && !isCategoriesDeleted) {
      return;
    }

    const promises = [];

    if (isCategoriesAdded) {
      promises.push(
          this._ArticleCategory.bulkCreate(
              sortedCategories.added.map((categoryId) => ({
                articleId,
                categoryId,
              }))
          )
      );
    }

    if (isCategoriesDeleted) {
      promises.push(
          this._ArticleCategory.destroy({
            where: {
              articleId,
              categoryId: {
                [Sequelize.Op.in]: sortedCategories.deleted,
              },
            },
          })
      );
    }

    await Promise.all(promises);
  }
}

module.exports = NotesService;
