"use strict";

const {Op} = require(`sequelize`);

class SearchService {
  constructor(sequelize) {
    this._Article = sequelize.models.Article;
  }

  async findAll(searchText) {
    return await this._Article.findAll({
      attributes: [`id`, `title`, `createdAt`],
      where: {
        title: {
          [Op.substring]: searchText.toLowerCase(),
        },
      },
      order: [[`createdAt`, `DESC`]],
    });
  }
}

module.exports = SearchService;
