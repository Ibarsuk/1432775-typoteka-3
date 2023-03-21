[![Deploy](https://github.com/Ibarsuk/typoteka/actions/workflows/deploy.yml/badge.svg?branch=production&event=push)](https://github.com/Ibarsuk/typoteka/actions/workflows/deploy.yml)
# Typoteka personal blog

## Environment vars
Env vars can be defined in `.env` file or using GitHub/GitLab enviroments. 
This project uses the following environment variables:

| Name                          | Description
| ----------------------------- | ------------------------------------|
|API_HOST           | Server location            |
|BACK_PORT           | API server port           |
|DB_HOST           | DB location           |
|DB_PORT           | DB port            |
|FRONT_PORT           | Client port            |

The following environment variables should be defined as **SECRETS**:

| Name                          | Description
| ----------------------------- | ------------------------------------|
|DB_NAME           | DB name            |
|DB_PASSWORD           | DB password           |
|DB_USER           | DB user           |
|JWT_ACCESS_SECRET           | Access JWT tokens secret encryption string           |
|JWT_REFRESH_SECRET           | Refresh JWT tokens secret encryption string            |


## Pre-requisites
- Install [Node.js](https://nodejs.org/en/) version 14.17.6


## Getting started
- Clone the repository
```
git clone  https://github.com/Ibarsuk/typoteka.git
```
- Install dependencies
```
cd typoteka
npm i
```
- Fill db with test values and generate docs
```
npm run filldb
npm run gen-docs
```
- Run the project
```
npm start
```
  Navigate to `http://<API_HOST>:<FRONT_PORT>`

- API Document endpoint

  Swagger-ui  Endpoint : `http://<API_HOST>:<FRONT_PORT>/docs`
  
### Or run docker container

```
docker compose -f docker-compose.yml -f docker-compose-prod.yml up --build -d
```

## Project Structure
The folder structure of this app is explained below:

| Name | Description |
| ------------------------ | ------------------------  |
| **github/workflows**                 | Contains files for github CI/CD actions workflows|
| **node_modules**         | Contains all  npm dependencies|
| **data**                  | Contains  examples for test DB entities generation   |
| **logs**                  | Contains  log files  |
| **markup**                  | Contains  source HTML markup  |
| **src**                  | Contains  source code                              |
| **src/express**      | Client server source code |
| **src/express/middlewares**      | Client server middlewares code |
| **src/express/public**      | Public resources |
| **src/express/routes**      | Client server routes definitions |
| **src/express/templates**      | Pug markup templates |
| **src/service**      | API server source code |
| **src/service/api**      | API server api routes definitions |
| **src/service/cli**      | Manually written CLI tools code |
| **src/service/data-service**      | Services for models interaction |
| **src/service/middlewares**      |  API server middlewares code |
| **src/service/models**      |  Models definitions |
| **src/service/validation-schemas**      |  Joi schemas for validation |
| **src/utils**      | Different useful functions and config files |

## NMP Scripts
All the different build, running, testing or filling steps are orchestrated via [npm scripts](https://docs.npmjs.com/misc/scripts).
Npm scripts basically allow us to call (and chain) terminal commands via npm.

| Npm Script | Description |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `start`                   | Runs full build and runs node servers                  |
| `start::dev`                   | Runs node servers in development mode with more detailed logs      |
| `start-back`                   | Runs API server only in production mode       |
| `start-back::dev`                   | Runs API server only in development mode       |
| `start-front`                   | Runs client server only in production mode       |
| `start-front::dev`                   | Runs client server only in development mode       |
| `test`                   | Runs all tests in chain        |
| `eslint`                   | Runs eslint testing                                         |
| `jest`                   | Runs jest testing                                         |
| `filldb`                   | Fills DB with 20 testing articles                                        |
| `gen-docs`                    | Generates swagger docs        |

## Testing
The tests are written in jest
To run tests execute:
```
npm run test
```
To run tests in docker container:
```
docker compose -f docker-compose-test.yml up --build --exit-code-from test
```

## Swagger
### Specification
The swagger specification file is named as swagger.json. The file is located under root folder. File is generated automatically via 
```
npm run gen-docs
```
## ESLint rules
All rules are configured through `eslint.yml`

## Dependencies
Dependencies are described in package.json:
```
"devDependencies": {
    "eslint": "7.32.0",
    "eslint-config-htmlacademy": "0.6.0",
    "eslint-plugin-jest": "25.2.2",
    "jest": "27.3.1",
    "nodemon": "2.0.13",
    "pino-pretty": "7.1.0",
    "sqlite3": "5.0.2",
    "supertest": "6.1.6",
    "swagger-autogen": "^2.23.1"
  },
```

```
"dependencies": {
    "axios": "0.24.0",
    "bcrypt": "5.0.1",
    "chalk": "4.1.2",
    "concurrently": "7.0.0",
    "cookie-parser": "1.4.6",
    "cross-env": "7.0.3",
    "csurf": "1.11.0",
    "dotenv": "10.0.0",
    "express": "4.17.1",
    "joi": "17.4.2",
    "joi-to-swagger": "^6.2.0",
    "jsonwebtoken": "8.5.1",
    "multer": "1.4.3",
    "nanoid": "3.1.30",
    "pg": "8.7.1",
    "pino": "7.0.5",
    "pug": "3.0.2",
    "sequelize": "6.12.0-alpha.1",
    "socket.io": "4.4.1",
    "swagger-ui-express": "^4.6.2"
  }
```
