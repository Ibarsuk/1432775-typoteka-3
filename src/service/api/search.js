"use strict";

const {Router} = require(`express`);
const {StatusCode} = require(`../../const`);

const route = new Router();

module.exports = (app, searchService) => {
  app.use(`/search`, route);

  route.get(`/`, async (req, res) => {
    /*
        #swagger.path = '/search'
        #swagger.tags = ['Search']
        #swagger.summary = 'Find article'
    */
    const {query} = req.query;

    if (!query.trim().length) {
      return res.status(StatusCode.BAD_REQUEST).send(`search query cann't be empty`);
    }

    const foundNotes = await searchService.findAll(query);
    return res.status(StatusCode.OK).json(foundNotes);
  });
};
