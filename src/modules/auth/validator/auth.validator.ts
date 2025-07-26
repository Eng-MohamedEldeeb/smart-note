import joi from 'joi'

import * as DTO from '../dto/auth.dto'

import { generalFields } from '../../../common/validation/general-fields'

export const confirmEmailValidator = {
  body: joi
    .object<DTO.IConfirmEmail>()
    .keys({
      email: generalFields.email.required().messages({
        'any.required': 'email is required',
        'string.empty': 'email cannot be empty',
      }),
    })
    .required()
    .messages({
      'any.required': 'confirmEmail body is required',
    }),
}

export const registerValidator = {
  body: joi
    .object<DTO.IRegister>()
    .keys({
      fullName: generalFields.fullName.required().messages({
        'any.required': 'fullName is required',
        'string.empty': 'fullName cannot be empty',
      }),
      email: generalFields.email.required().messages({
        'any.required': 'email is required',
        'string.empty': 'email cannot be empty',
      }),
      password: generalFields.password.required().messages({
        'any.required': 'password is required',
        'string.empty': 'password cannot be empty',
      }),
      confirmPassword: generalFields.password
        .valid(joi.ref('password'))
        .required()
        .messages({
          'any.required': 'confirmPassword is required',
          'string.empty': 'confirmPassword cannot be empty',
        }),
      phone: generalFields.phone,
      birthDate: generalFields.birthDate.required().messages({
        'any.required': 'birthDate  is required',
        'string.empty': 'birthDate cannot be empty',
      }),
      otpCode: generalFields.otpCode.required().messages({
        'any.required': 'otpCode is required',
        'string.empty': 'otpCode cannot be empty',
      }),
    })
    .required()
    .messages({
      'any.required': 'register body is required',
    }),
}

export const loginValidator = {
  body: joi
    .object<DTO.ILogin>()
    .keys({
      email: generalFields.email.required().messages({
        'any.required': 'email is required',
        'string.empty': 'email cannot be empty',
      }),
      password: generalFields.password.required().messages({
        'any.required': 'password is required',
        'string.empty': 'password cannot be empty',
      }),
    })
    .required()
    .messages({
      'any.required': 'login body is required',
    }),
}

export const forgotPasswordValidator = {
  body: joi
    .object<DTO.IForgotPassword>()
    .keys({
      email: generalFields.email.required().messages({
        'any.required': 'email is required',
        'string.empty': 'email cannot be empty',
      }),
    })
    .required()
    .messages({
      'any.required': 'forgotPassword body is required',
    }),
}

export const resetPasswordValidator = {
  body: joi
    .object<DTO.IResetPassword>()
    .keys({
      email: generalFields.email.required().messages({
        'any.required': 'email is required',
        'string.empty': 'email cannot be empty',
      }),
      newPassword: generalFields.password.required().messages({
        'any.required': 'password is required',
        'string.empty': 'password cannot be empty',
      }),
      confirmPassword: generalFields.password
        .valid(joi.ref('newPassword'))
        .required()
        .messages({
          'any.required': 'confirmPassword is required',
          'string.empty': 'confirmPassword cannot be empty',
        }),
      otpCode: generalFields.otpCode.required().messages({
        'any.required': 'otpCode is required',
        'string.empty': 'otpCode cannot be empty',
      }),
    })
    .required()
    .messages({
      'any.required': 'resetPassword body is required',
    }),
}
