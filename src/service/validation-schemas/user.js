"use strict";

const Joi = require(`joi`);
const messages = require(`./validation-messages`);

const NAME_PATTERN = /[^0-9$&+,:;=?@#| '<>.^*()%!]+$/;
const PASSWORD_MIN_LENGTH = 6;

const Field = {
  EMAIL: `Электронная почта`,
  PASSWORD: `Пароль`,
  REPEATED_PASSWORD: `Повтор пароля`,
};

const newUserSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.email": messages.string.email(Field.EMAIL),
    }),

  firstName: Joi.string().pattern(NAME_PATTERN).required().messages({
    "string.pattern.base": messages.string.userName(),
  }),

  lastName: Joi.string().pattern(NAME_PATTERN).required().messages({
    "string.pattern.base": messages.string.userName(),
  }),

  password: Joi.string()
    .min(PASSWORD_MIN_LENGTH)
    .required()
    .messages({
      "string.min": messages.string.min(Field.PASSWORD, PASSWORD_MIN_LENGTH),
    }),

  repeatedPassword: Joi.string()
    .required()
    .messages({
      "any.only": messages.any.only(Field.REPEATED_PASSWORD, Field.PASSWORD),
    }),

  avatar: Joi.string(),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email()
    .required()
    .messages({
      "string.email": messages.string.email(Field.EMAIL),
    }),

  password: Joi.string().required(),
});

module.exports = {
  newUserSchema,
  loginSchema,
};
