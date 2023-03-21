"use strict";

const swaggerAutogen = require(`swagger-autogen`)();
const path = require(`path`);
const {filesToDoc} = require(`../../const`);

const doc = {
  info: {
    title: `Typoteka API`,
    description: `Api docs for typoteka personal blog`,
    version: `1.0.0`,
  },
  host: `localhost:3000`,
  basePath: `/api`,
  schemes: [`http`],
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
const endpointsFiles = filesToDoc.map((file) => path.join(__dirname, `../api/${file}`));

const run = (cb = ()=>{}) => {
  swaggerAutogen(outputFile, endpointsFiles, doc).then(cb);
};

module.exports = {
  name: `--swagger`,
  run,
};
