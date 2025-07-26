import joi from 'joi'

import * as regex from './regex'

import { isValidMongoId, isValidToken, optionalMongoId } from './is-valid'

const file = joi.object<Express.Multer.File>().keys({
  fieldname: joi.string(),
  originalname: joi.string(),
  encoding: joi.string(),
  mimetype: joi.string(),
  destination: joi.string(),
  filename: joi.string(),
  path: joi.string(),
  size: joi.number(),
})

export const generalFields = {
  mongoId: joi.string().custom(isValidMongoId),

  optionalMongoId: joi.string().custom(optionalMongoId),

  headers: joi
    .object()
    .keys({
      authorization: joi.string().custom(isValidToken),
    })
    .unknown(true),

  file,

  files: joi.array().items(file).min(1).max(10),

  fullName: joi.string().trim().messages({
    'string.empty': "fullName can't be empty",
  }),

  email: joi.string().email().trim().lowercase().messages({
    'string.empty': "email can't be empty",
    'string.email': 'in-valid email',
  }),

  password: joi
    .string()
    .pattern(regex.passwordPattern)
    .min(8)
    .max(16)
    .trim()
    .messages({
      'string.empty': "password can't be empty",
    }),

  phone: joi.string().pattern(regex.phonePattern),

  birthDate: joi.date().less('now').messages({
    'string.empty': "birthDate can't be empty",
    'date.base': 'enter a valid birthDate',
  }),

  otpCode: joi.string().length(4).messages({
    'string.empty': "otpCode can't be empty",
  }),

  title: joi.string().trim().messages({
    'string.empty': "title can't be empty",
  }),

  body: joi.string().trim().messages({
    'string.empty': "body can't be empty",
  }),
}
