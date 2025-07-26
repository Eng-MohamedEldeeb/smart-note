import { Response } from 'express'
import { IRequest } from '../../common/interface/IRequest.interface'
import { successResponse } from '../../common/handlers/http/success-response.handler'
import { asyncHandler } from '../../common/decorators/async-handler/async-handler.decorator'
import { UserService } from './user.service'
import { ILogOut } from './dto/user.dto'

export class UserController {
  private static readonly UserService = UserService
  static readonly logout = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: userId, fullName } = req.user
      const logOutDTO: ILogOut = req.body

      await this.UserService.logout({ userId, logOutDTO })

      return successResponse(res, {
        msg: `Logged Out Successfully, We're sad to see you going ${fullName} 😢`,
      })
    },
  )

  static readonly changeProfilePicture = asyncHandler(
    async (req: IRequest, res: Response) => {
      const { _id: userId, avatar } = req.user

      return successResponse(res, {
        msg: 'Profile Picture has been updated successfully',
        data: await this.UserService.changeAvatar({
          path: avatar,
          userId,
        }),
      })
    },
  )
}
