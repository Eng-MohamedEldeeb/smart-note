import { Router } from 'express'
import { AuthController } from './auth.controller'
import { validate } from '../../common/middlewares/validation/validation.middleware'

import * as validators from './validator/auth.validator'

const router: Router = Router()

/**
 * @method POST
 * @link /auth/confirm-email
 * @description To Send Confirmation E-email with OTP Code To User for a Safety Registration
 **/
router.post(
  '/confirm-email',
  validate(validators.confirmEmailValidator),
  AuthController.confirmEmail,
)

/**
 * @method POST
 * @link /auth/register
 * @description Registering a new user in the Database
 * @requires otpCode
 **/
router.post(
  '/register',
  validate(validators.registerValidator),
  AuthController.register,
)

/**
 * @method POST
 * @link /auth/register
 * @description For Receiving accessToken
 **/
router.post('/login', validate(validators.loginValidator), AuthController.login)

/**
 * @method POST
 * @link /auth/register
 * @description to request a verification code to reset password in case of forgetting it
 * @requires email
 **/
router.post(
  '/forgot-password',
  validate(validators.forgotPasswordValidator),
  AuthController.forgotPassword,
)

/**
 * @method PATCH
 * @link /auth/register
 * @description Resetting the old password with a new one by validating otpCode
 * @requires otpCode
 * @requires newPassword
 **/
router.patch(
  '/reset-password',
  validate(validators.resetPasswordValidator),
  AuthController.resetPassword,
)

export default router
