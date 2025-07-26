import { Router } from 'express'
import { UserController } from './user.controller'
import { validate } from '../../common/middlewares/validation/validation.middleware'
import { FileUploader } from '../../common/middlewares/upload/file-uploader.middleware'

import * as validators from './validator/user.validator'

const router: Router = Router()

/**
 * @method POST
 * @link /user/log-out
 * @description To Deprecate the generated Token
 * @requires @authorization Bearer token
 **/
router.post(
  '/log-out',
  validate(validators.logOutValidator),
  UserController.logout,
)

/**
 * @method PATCH
 * @link /user/upload-profile-pic
 * @description To Change user's profile picture
 * @requires @authorization Bearer token
 **/
router.patch(
  '/upload-profile-pic',
  FileUploader.uploadLocally('image/jpeg', 'image/jpeg', 'image/png').single(
    'avatar',
  ),
  validate(validators.changePictureValidator),
  UserController.changeProfilePicture,
)

export default router
