import { generalFields } from '../../../common/validation/general-fields'
import { loginValidator } from '../../auth/validator/auth.validator'

export const logOutValidator = loginValidator

export const changePictureValidator = {
  file: generalFields.file.required().messages({
    'any.required': 'avatar file is required',
  }),
}
