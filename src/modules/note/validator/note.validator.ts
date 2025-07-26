import joi from 'joi'

import * as DTO from '../dto/note.dto'

import { generalFields } from '../../../common/validation/general-fields'

export const getNoteSummarizeValidator = {
  params: joi.object<DTO.INoteIdDto>().keys({
    id: generalFields.mongoId.required().messages({
      'any.required': 'id is required in params',
      'string.empty': 'id cannot be empty',
      'string.base': 'id is in-valid',
    }),
  }),
}

export const getAllValidator = {
  args: joi.object<DTO.IGetNotesQueryDto>().keys({
    search: joi.string().messages({
      'any.required': 'bearer token is required',
      'string.empty': 'bearer token cannot be empty',
      'string.base': 'in valid bearer token',
    }),
    page: joi
      .number()
      .when('limit', { is: joi.exist(), then: joi.required() })
      .messages({
        'any.required': 'page number is required',
        'number.base': 'page must be a number',
      }),
    limit: joi.number().messages({
      'number.base': 'limit must be a number',
    }),
    sort: joi.number().valid(1, -1).messages({
      'number.base': 'sort must be a number',
      'any.only': 'sort must be a number, [1] ascending, or [-1] descending',
    }),
  }),

  context: generalFields.headers.required().messages({
    'any.required': 'bearer token is required',
    'string.empty': 'bearer token cannot be empty',
    'string.base': 'in valid bearer token',
  }),
}

export const createValidator = {
  body: joi
    .object<DTO.ICreateNoteDto>()
    .keys({
      title: generalFields.title.required().required().messages({
        'any.required': 'title is required',
        'string.empty': 'title cannot be empty',
      }),
      body: generalFields.body,
    })
    .required()
    .messages({
      'any.required': 'createNote body is required',
    }),
}

export const deleteNoteValidator = {
  params: joi.object<DTO.INoteIdDto>().keys({
    id: generalFields.mongoId.required().messages({
      'any.required': 'id is required in params',
      'string.empty': 'id cannot be empty',
      'string.base': 'id is in-valid',
    }),
  }),
}
