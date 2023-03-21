"use strict";

const FRONT_DEFAULT_PORT = 8080;
const TIMEOUT = 10000;

const BACK_DEFAULT_PORT = 3000;
const DEFAULT_COMMAND = `--help`;

const Env = {
  DEVELOPMENT: `development`,
  PRODUCTION: `production`,
};

const ExitCode = {
  SUCCESS: 0,
  ERROR: 1,
};

const StatusCode = {
  OK: 200,
  CREATED: 201,
  TOKEN_REFRESH: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

const HttpMethod = {
  GET: `get`,
  POST: `post`,
  PUT: `put`,
  DELETE: `delete`,
};

const Role = {
  ADMIN: `admin`,
};

const ClientDir = {
  UPLOAD: `upload`,
  PUBLIC: `public`,
};

const LOG_DIR = `logs/`;

const LogPath = {
  API: LOG_DIR + `api-logs.log`,
  FRONT: LOG_DIR + `front-logs.log`
};

const FILL_DB_QUERY_FILE_NAME = `fill-db.sql`;
const FAKE_DATA_PATH = `data/`;

const MockFileName = {
  NOTE_SENTENCES: `sentences.txt`,
  TITLES: `titles.txt`,
  CATEGORIES: `categories.txt`,
  COMMENT_SENTENCES: `comment-sentences.txt`,
  PHOTOS: `photos.txt`,
  NAMES: `names.txt`,
};

const MockСomprisingPath = {
  SENTENCES: FAKE_DATA_PATH + MockFileName.NOTE_SENTENCES,
  TITLES: FAKE_DATA_PATH + MockFileName.TITLES,
  CATEGORIES: FAKE_DATA_PATH + MockFileName.CATEGORIES,
  COMMENT_SENTENCES: FAKE_DATA_PATH + MockFileName.COMMENT_SENTENCES,
  PHOTOS: FAKE_DATA_PATH + MockFileName.PHOTOS,
  NAMES: FAKE_DATA_PATH + MockFileName.NAMES
};

const events = {
  comment: {
    create: `comment:create`,
  }
};

const filesToDoc = [
  `articles.js`,
  `categories.js`,
  `comments.js`,
  `my.js`,
  `search.js`,
  `users.js`,
];

module.exports = {
  FRONT_DEFAULT_PORT,
  TIMEOUT,
  BACK_DEFAULT_PORT,
  DEFAULT_COMMAND,
  Env,
  ExitCode,
  StatusCode,
  HttpMethod,
  Role,
  FILL_DB_QUERY_FILE_NAME,
  FAKE_DATA_PATH,
  ClientDir,
  LogPath,
  MockFileName,
  MockСomprisingPath,
  events,
  filesToDoc,
};
