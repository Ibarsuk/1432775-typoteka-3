"use strict";

const express = require(`express`);
const Sequelize = require(`sequelize`);
const http = require(`http`);
const {initdb} = require(`./sequelize`);
const testData = require(`../service/test-data`);
const usersDefiner = require(`../service/api/users`);
const UserService = require(`../service/data-service/user`);
const TokenService = require(`../service/data-service/token`);
const socket = require(`../utils/socket`);

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffle = (someArray) => {
  for (let i = someArray.length - 1; i > 0; i--) {
    const randomPosition = Math.floor(Math.random() * i);
    [someArray[i], someArray[randomPosition]] = [
      someArray[randomPosition],
      someArray[i],
    ];
  }

  return someArray;
};

const getFileNameFromPath = (path) => path.split(`/`).pop();

const getCheckboxArray = (
    body,
    fieldPreffix,
    {isNumber = false} = {inNumber: false}
) => {
  const checkboxes = [];
  for (const [key, value] of Object.entries(body)) {
    if (key.startsWith(fieldPreffix) && value === `on`) {
      const fieldName = key.split(fieldPreffix).pop();
      const prepearedName = isNumber ? +fieldName : fieldName;
      checkboxes.push(prepearedName);
      delete body[key];
    }
  }
  return checkboxes;
};

const getRandomDate = (pastPediodTime) => {
  const currentDate = +new Date();
  const minCreationData = currentDate - pastPediodTime;
  return new Date(getRandomInt(minCreationData, currentDate));
};

const getSQLStringFromArray = (arr) =>
  arr
    .map(
        (el) =>
          `(${Object.values(el)
          .map((value) => (isNaN(value) ? `'${value}'` : value))
          .join(`,`)})`
    )
    .join(`,\n`);

const createTestApi = async (routeDefiner, ...services) => {
  const mockdb = new Sequelize(`sqlite::memory`, {logging: false});
  await initdb(mockdb, testData);

  const app = express();
  const server = http.createServer(app);
  const io = socket(server);

  app.io = io;
  app.use(express.json());

  usersDefiner(app, new UserService(mockdb), new TokenService(mockdb));
  routeDefiner(app, ...services.map((Service) => new Service(mockdb)));

  return app;
};

module.exports = {
  getRandomInt,
  shuffle,
  getFileNameFromPath,
  getCheckboxArray,
  getRandomDate,
  getSQLStringFromArray,
  createTestApi,
};
