"use strict";

const {Router} = require(`express`);
const {StatusCode, Role} = require(`../../const`);
const authJwt = require(`../middlewares/auth-jwt`);

const route = new Router();

module.exports = (app, commentService, articleService) => {
  app.use(`/my`, route);

  route.use(authJwt(Role.ADMIN));

  route.get(`/`, async (_req, res) => {
    /*
        #swagger.path = '/my'
        #swagger.tags = ['My']
        #swagger.summary = 'Get user's articles'
    */
    const myArticles = await articleService.findUserArticles(res.user.id);
    res.status(StatusCode.OK).json(myArticles);
  });

  route.get(`/comments`, async (_req, res) => {
    /*
        #swagger.path = '/my/comments'
        #swagger.tags = ['My']
        #swagger.summary = 'Get user's comments'
    */
    const myComments = await commentService.findAll();
    res.status(StatusCode.OK).json(myComments);
  });
};
