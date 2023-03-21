"use strict";

require(`dotenv`).config();
const express = require(`express`);
const cookieParser = require(`cookie-parser`);
const path = require(`path`);
const swaggerUi = require(`swagger-ui-express`);

const {StatusCode, FRONT_DEFAULT_PORT, ClientDir} = require(`../const`);
const router = require(`./routes`);
const {getFrontLogger} = require(`../utils/logger`);
const {NotFoundError, UnauthorizedError} = require(`../utils/exceptions`);
const pinUserObj = require(`./middlewares/pin-user-obj`);
const swaggerDocument = require(`../../swagger.json`);

const logger = getFrontLogger({name: `express`});

const app = express();
const port = process.env.FRONT_PORT || FRONT_DEFAULT_PORT;

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(pinUserObj);

app.use(router);

app.use(
    `/docs`,
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument, {
      explorer: true,
      openapi: `3.0.0`,
    })
);
app.use(express.static(path.resolve(__dirname, ClientDir.PUBLIC)));
app.use(express.static(path.resolve(__dirname, ClientDir.UPLOAD)));
app.set(`views`, path.resolve(__dirname, `templates`));
app.set(`view engine`, `pug`);

app.use((_, res) => res.status(StatusCode.NOT_FOUND).render(`404`));

app.use((err, _req, res, _next) => {
  if (err instanceof NotFoundError) {
    return res.status(StatusCode.NOT_FOUND).render(`404`);
  }

  if (err instanceof UnauthorizedError) {
    return res.status(StatusCode.UNAUTHORIZED).redirect(`/login`);
  }

  logger.error(`Error 500: ${err.message}`);
  return res.status(StatusCode.INTERNAL_SERVER_ERROR).render(`500`);
});

app.listen(port, () => {
  logger.info(`Started on port ${port}`);
});
