"use strict";

const swaggerAutogen = require(`swagger-autogen`);
const path = require(`path`);
const j2s = require(`joi-to-swagger`);

const {filesToDoc} = require(`../../const`);
const {noteSchema, noteUpdateSchema} = require(`../validation-schemas/note`);
const {newCategorySchema} = require(`../validation-schemas/category`);
const {commentSchema} = require(`../validation-schemas/comment`);
const {newUserSchema, loginSchema} = require(`../validation-schemas/user`);

const doc = {
  info: {
    title: `Typoteka API`,
    description: `Api docs for typoteka personal blog`,
    version: `1.0.0`,
  },
  host: `localhost:3000`,
  basePath: `/api`,
  schemes: [`http`],
  securityDefinitions: {
    bearerAuth: {
      type: `http`,
      scheme: `bearer`,
      bearerFormat: `JWT`,
    },
  },
  definitions: {
    Article: j2s(noteSchema).swagger,
    Articles: [j2s(noteSchema).swagger],
    ArticleUpdate: j2s(noteUpdateSchema).swagger,
    Category: j2s(newCategorySchema).swagger,
    Categories: [j2s(newCategorySchema).swagger],
    Comment: j2s(commentSchema).swagger,
    Comments: [j2s(commentSchema).swagger],
    User: j2s(newUserSchema).swagger,
    Login: j2s(loginSchema).swagger,
    Tokens: {
      type: `object`,
      properties: {
        access: {
          type: `string`,
          description: `Access token`,
        },
        refresh: {
          type: `string`,
          description: `Refresh token`,
        },
      },
    },
    LoginResponse: {
      type: `object`,
      properties: {
        tokens: {$ref: `#/definitions/Tokens`},
        user: {$ref: `#/definitions/User`},
      },
    },
  },
  tags: [
    {
      name: `Articles`,
      description: `Articles endpoints`,
    },
    {
      name: `Categories`,
      description: `Categories endpoints`,
    },
    {
      name: `Comments`,
      description: `Comments endpoints`,
    },
    {
      name: `My`,
      description: `Endpoints for personal entities`,
    },
    {
      name: `Search`,
      description: `Search endpoints`,
    },
    {
      name: `Users`,
      description: `Users endpoints`,
    },
  ],
};

const outputFile = path.join(__dirname, `../../../swagger.json`);
const endpointsFiles = filesToDoc.map((file) =>
  path.join(__dirname, `../api/${file}`)
);

const run = (cb = () => {}) => {
  swaggerAutogen({openapi: `3.0.0`})(outputFile, endpointsFiles, doc).then(cb);
};

module.exports = {
  name: `--swagger`,
  run,
};
