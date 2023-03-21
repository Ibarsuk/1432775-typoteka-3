"use strict";

const version = require(`./version`);
const help = require(`./help`);
const server = require(`./server`);
const fill = require(`./fill/fill`);
const fillDb = require(`./filldb`);
const swagger = require(`./swagger`);

module.exports = {
  [version.name]: version,
  [help.name]: help,
  [server.name]: server,
  [fill.name]: fill,
  [fillDb.name]: fillDb,
  [swagger.name]: swagger,
};
