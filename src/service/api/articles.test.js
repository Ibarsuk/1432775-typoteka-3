"use strict";

require(`dotenv`).config();
const stdRequest = require(`supertest`);

const articles = require(`./articles`);
const NoteService = require(`../data-service/notes-service`);
const CommentService = require(`../data-service/comments-service`);
const CategoryService = require(`../data-service/category`);

const {StatusCode, HttpMethod} = require(`../../const`);
const {createTestApi} = require(`../../utils/util`);

const configRequest = require(`../../utils/supertest`);

const validToCreationArticle = {
  title: `Вы никогда не видели таких писем, которые мы с Гарри получили о наших грушах`,
  createdAt: `2021-12-22T07:08:37.646Z`,
  categories: [1, 3, 6],
  announce: `Не донимай молчащего вопросами! А вдруг он молчит про тебя? А вдруг нецензурно?`,
  fullText: `План на завтра - составить план на послезавтра. Когда жители Урюпинска умирают, они попадают в рай или обратно в Урюпинск. Реальный показатель успешного человека - носки без дыр!`,
  photo: {
    name: `name`,
    uniqueName: `SAidhgbjja7`,
  },
};

const vealidToCreationComment = {
  text: `Давно не пользуюсь стационарными компьютерами. Ноутбуки победили.`,
};

describe(`/articles route works correctly with articles`, () => {
  let app;
  let request;

  beforeAll(async () => {
    app = await createTestApi(
        articles,
        NoteService,
        CommentService,
        CategoryService
    );

    const res = await stdRequest(app)
      .post(`/users/auth`)
      .send({email: `admin@typoteka.com`, password: `12341234`});

    request = configRequest(app, res.body.tokens.accessToken);
  });

  it(`Returns list of aricles`, async () => {
    const res = await request(HttpMethod.GET, `/articles`);

    expect(res.statusCode).toBe(StatusCode.OK);
    expect(res.body.rows.length).toBe(3);
  });

  describe(`Article creation works correctly`, () => {
    let validArticle;
    beforeEach(() => {
      validArticle = {...validToCreationArticle};
    });

    it(`Creates new article`, async () => {
      const res = await request(HttpMethod.POST, `/articles`).send(
          validArticle
      );

      expect(res.statusCode).toBe(StatusCode.CREATED);

      expect(res.body.title).toBe(
          `Вы никогда не видели таких писем, которые мы с Гарри получили о наших грушах`
      );
    });

    it(`Should return 400 if one of required fields is missing`, async () => {
      // non required field
      delete validArticle.fullText;
      delete validArticle.photo;

      await Promise.all(
          Object.keys(validArticle).map(async (key) => {
            const invalidArticle = Object.assign({}, validArticle);
            delete invalidArticle[key];

            const res = await request(HttpMethod.POST, `/articles`).send(
                invalidArticle
            );

            expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
          })
      );
    });

    it(`Should return 400 if there is an unexpected field`, async () => {
      validArticle.unexpectedField = `some value`;

      const res = await request(HttpMethod.POST, `/articles`).send(
          validArticle
      );

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
    });
  });

  describe(`Returns article by id`, () => {
    it(`Returns correct article by id`, async () => {
      const res = await request(HttpMethod.GET, `/articles/1`);

      expect(res.statusCode).toBe(StatusCode.OK);
      expect(res.body.id).toBe(1);
    });

    it(`Returns 404 if article with given id doesn't exist`, async () => {
      const res = await request(HttpMethod.GET, `/articles/67356`);

      expect(res.statusCode).toBe(StatusCode.NOT_FOUND);
    });

    it(`Returns 400 if id is invalid`, async () => {
      const res = await request(HttpMethod.GET, `/articles/asd`);

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
    });
  });

  describe(`Article update works correctly`, () => {
    let validUpdate;
    beforeEach(() => {
      validUpdate = {...validToCreationArticle};
    });

    it(`Updates article if update is valid`, async () => {
      const res = await request(HttpMethod.PUT, `/articles/3`).send(
          validUpdate
      );

      expect(res.statusCode).toBe(StatusCode.OK);
    });

    it(`Returns 404 if article with given id doesn't exist`, async () => {
      const res = await request(HttpMethod.PUT, `/articles/3425`).send(
          validUpdate
      );

      expect(res.statusCode).toBe(StatusCode.NOT_FOUND);
    });

    it(`Returns 404 if id is invalid`, async () => {
      const res = await request(HttpMethod.PUT, `/articles/gad`).send(
          validUpdate
      );

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
    });

    it(`Returns 400 if article update is invalid`, async () => {
      validUpdate.unexpectedField = `some value`;
      const res = await request(HttpMethod.PUT, `/articles/3`).send(
          validUpdate
      );

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
    });
  });

  describe(`Article deletion works correctly`, () => {
    it(`Deletes article`, async () => {
      const res = await request(HttpMethod.DELETE, `/articles/3`);
      expect(res.statusCode).toBe(StatusCode.OK);
      expect(res.body).toBe(1);

      const findRes = await request(HttpMethod.GET, `/articles/3`);
      expect(findRes.statusCode).toBe(StatusCode.NOT_FOUND);
    });

    it(`Returns 0 in body if article with given id doesn't exist`, async () => {
      const res = await request(HttpMethod.DELETE, `/articles/2342`);

      expect(res.statusCode).toBe(StatusCode.OK);
      expect(res.body).toBe(0);
    });
  });
});

describe(`/articles route works correctly with comments`, () => {
  let app;
  let request;

  beforeAll(async () => {
    app = await createTestApi(
        articles,
        NoteService,
        CommentService,
        CategoryService
    );

    const res = await stdRequest(app)
      .post(`/users/auth`)
      .send({email: `admin@typoteka.com`, password: `12341234`});

    request = configRequest(app, res.body.tokens.accessToken);
  });

  describe(`Creates new comment for given id article`, () => {
    let validComment;
    beforeEach(() => {
      validComment = {...vealidToCreationComment};
    });

    it(`Creates new comment`, async () => {
      const res = await request(HttpMethod.POST, `/articles/2/comments`).send(
          validComment
      );

      expect(res.statusCode).toBe(StatusCode.CREATED);
      expect(res.body.articleId).toBe(2);
    });

    it(`Returns 404 if given article doesn't exist`, async () => {
      const res = await request(
          HttpMethod.POST,
          `/articles/2235/comments`
      ).send(validComment);

      expect(res.statusCode).toBe(StatusCode.NOT_FOUND);
    });

    it(`Returns 400 if not all required fields are presented`, async () => {
      const res = await request(HttpMethod.POST, `/articles/2/comments`).send(
          {}
      );

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
    });

    it(`Returns 400 if unexpected field is presented`, async () => {
      validComment.unexpectedField = 1456;
      const res = await request(HttpMethod.POST, `/articles/2/comments`).send(
          validComment
      );

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
    });
  });

  describe(`Deletes comment of given id article`, () => {
    it(`Deletes comment`, async () => {
      const res = await request(HttpMethod.DELETE, `/articles/1/comments/2`);
      expect(res.statusCode).toBe(StatusCode.OK);
    });

    it(`Returns 400 if id is invalid`, async () => {
      const res = await await request(HttpMethod.DELETE, `/articles/1/comments/adga`);

      expect(res.statusCode).toBe(StatusCode.BAD_REQUEST);
    });

    it(`Returns 404 in body if given comment doesn't exist`, async () => {
      const res = await await request(HttpMethod.DELETE, `/articles/1/comments/3473`);

      expect(res.statusCode).toBe(StatusCode.NOT_FOUND);
    });
  });
});
