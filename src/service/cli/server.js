"use strict";

const express = require(`express`);

const {StatusCode, BACK_DEFAULT_PORT} = require(`../../const`);
const routes = require(`../api`);
const {getLogger} = require(`../../utils/logger`);
const logRequest = require(`../middlewares/logRequest`);

const logger = getLogger({name: `api`});
const app = express();
app.use(express.json());

app.use(logRequest);
app.use(`/api`, routes);

app.use((req, res) => {
  res.status(StatusCode.NOT_FOUND).send(`Not found`);
  logger.error(`Route not found: ${req.url}`);
});

app.use((_req, _res, _next, err) => {
  logger.error(`Error during request handling: ${err.message}`);
});

const run = () => {
  const port = process.env.BACK_PORT || BACK_DEFAULT_PORT;

  if (port < 0 || port > 65535) {
    throw new Error(
        logger.error(`Port can't be less than 0 or bigger than 65535`)
    );
  }

  app.listen(port, (err) => {
    if (err) {
      logger.error(`Error on server creation: ${err.message}`);
      process.exit(1);
    }
    logger.info(`Server started on port ${port}`);
  });
};

module.exports = {
  name: `--server`,
  run,
};
