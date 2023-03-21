"use strict";

const {Router} = require(`express`);

const {newCategorySchema} = require(`../validation-schemas/category`);
const validateBody = require(`../middlewares/validation/validate-body`);
const validateParams = require(`../middlewares/validation/validate-params`);
const authJwt = require(`../middlewares/auth-jwt`);

const {StatusCode, Role} = require(`../../const`);

const route = new Router();

module.exports = (app, categoryService) => {
  app.use(`/categories`, route);

  route.get(`/`, async (_req, res) => {
    /*
        #swagger.path = '/categories'
        #swagger.tags = ['Categories']
        #swagger.summary = 'Get all categories'
        #swagger.responses[200] = {
            description: "All categories",
            schema: { $ref: '#/definitions/Categories' }
        }
    */
    const categories = await categoryService.findAll();
    return res.status(StatusCode.OK).json(categories);
  });

  route.post(
      `/`,
      authJwt(Role.ADMIN),
      validateBody(newCategorySchema),
      async (req, res) => {
        /*
        #swagger.path = '/categories'
        #swagger.tags = ['Categories']
        #swagger.summary = 'Create new category'
        #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Category obj',
                schema: { $ref: '#/definitions/Category' }
        }
        #swagger.responses[200] = {
            description: "Create category",
            schema: { $ref: '#/definitions/Category' }
        }
    */
        const newCategory = await categoryService.create(req.body);
        return res.status(StatusCode.CREATED).json(newCategory);
      }
  );

  route.put(
      `/:id`,
      [authJwt(Role.ADMIN), validateParams, validateBody(newCategorySchema)],
      async (req, res) => {
        /*
        #swagger.path = '/categories/{:id}'
        #swagger.tags = ['Categories']
        #swagger.summary = 'Edit category by id'
        #swagger.parameters['obj'] = {
                in: 'body',
                description: 'Category obj',
                schema: { $ref: '#/definitions/Category' }
        }
        #swagger.responses[200] = {
            description: "Updated Category",
            schema: { $ref: '#/definitions/Category' }
        }
    */
        const {id} = req.params;
        const updatedCategory = await categoryService.update(id, req.body);
        return res.status(StatusCode.OK).json(updatedCategory);
      }
  );

  route.delete(`/:id`, [authJwt(Role.ADMIN), validateParams], async (req, res) => {
    /*
        #swagger.path = '/categories/{:id}'
        #swagger.tags = ['Categories']
        #swagger.summary = 'Delete category by id'
        #swagger.responses[200] = {
            description: "Category deleted",
        }
        #swagger.responses[403] = {
            description: "Forbidden",
        }
    */
    const {id} = req.params;
    const isAtLeastOneRelationFound = await categoryService.findOneRelation(id);
    if (isAtLeastOneRelationFound) {
      return res.status(StatusCode.FORBIDDEN).send(`Can't delete`);
    }

    await categoryService.drop(id);

    return res.status(StatusCode.OK).send();
  });
};
