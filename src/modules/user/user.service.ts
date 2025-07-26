import { AuthService } from './../auth/auth.service'
import userRepository from '../../common/repositories/user.repository'

import { MongoId } from '../../common/types/db/db.types'
import { ILogOut } from './dto/user.dto'

export class UserService {
  protected static readonly AuthService = AuthService
  protected static readonly userRepository = userRepository

  static readonly logout = async ({
    userId,
    logOutDTO,
  }: {
    userId: MongoId
    logOutDTO: ILogOut
  }) => {
    await this.AuthService.login(logOutDTO)

    return await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: {
        $set: { loggedOutAt: Date.now() },
      },
    })
  }

  static readonly changeAvatar = async ({
    userId,
    path,
  }: {
    userId: MongoId
    path: string
  }) => {
    return await this.userRepository.findByIdAndUpdate({
      _id: userId,
      data: {
        avatar: path,
      },
      options: { new: true, lean: true, projection: { avatar: 1 } },
    })
  }
}
