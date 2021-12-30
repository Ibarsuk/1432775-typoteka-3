"use strict";

// solves problem when pg converts int into string
require(`pg`).defaults.parseInt8 = true;

const Sequelize = require(`sequelize`);
const {Env} = require(`../const`);
const {DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME} = process.env;

module.exports = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: `postgres`,
  pool: {
    min: 0,
    max: 5,
    acquire: 10000,
    idle: 10000
  },
  logging: process.env.NODE_ENV === Env.PRODUCTION ? false : console.log,
});
