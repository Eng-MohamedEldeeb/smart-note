import otpRepository from '../../common/repositories/otp.repository'
import userRepository from '../../common/repositories/user.repository'

import * as DTO from './dto/auth.dto'

import { throwError } from '../../common/handlers/error-message.handler'
import { compareValues } from '../../common/utils/security/hash/security.service'
import { signToken } from '../../common/utils/security/token/token.service'
import { OtpType } from '../../db/enums/otp.enum'

export class AuthService {
  private static readonly userRepository = userRepository
  private static readonly otpRepository = otpRepository

  static readonly confirmEmail = async (confirmEmailDTO: DTO.IConfirmEmail) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { email: confirmEmailDTO.email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (isExistedUser)
      return throwError({ msg: 'user already exists', status: 409 })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: confirmEmailDTO.email },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: confirmEmailDTO.email,
      type: OtpType.confirmRegistration,
    })
  }

  static readonly register = async (
    register: Omit<
      DTO.IRegister,
      'avatar' | 'confirmPassword' | 'bio' | 'isPrivateProfile'
    >,
  ) => {
    const { fullName, email, password, phone, birthDate, otpCode } = register

    const isConflicted = await this.userRepository.findOne({
      filter: {
        email,
      },
    })

    if (isConflicted)
      return throwError({
        msg: 'e-mail and email must be unique',
        status: 400,
      })

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email, type: OtpType.confirmRegistration },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!isExistedOtp) return throwError({ msg: 'in-valid code', status: 400 })

    const validOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!validOtp) return throwError({ msg: 'in-valid code', status: 400 })

    await this.userRepository.create({
      fullName,
      email,
      password,
      phone,
      birthDate,
    })

    const { accessToken } = await this.login({ email, password })

    return accessToken
  }

  static readonly login = async (loginDTO: DTO.ILogin) => {
    const { email, password } = loginDTO

    const isExistedUser = await this.userRepository.findOne({
      filter: { email },
      projection: { _id: 1, email: 1, password: 1, fullName: 1 },
      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({
        msg: 'in-valid email or password',
        status: 400,
      })

    const isMatchedPasswords = compareValues({
      value: password,
      hashedValue: isExistedUser.password,
    })

    if (!isMatchedPasswords)
      return throwError({
        msg: 'in-valid email or password',
        status: 400,
      })

    const accessToken = signToken({
      payload: {
        _id: isExistedUser._id,
      },
      options: {
        expiresIn: '7d',
      },
    })

    return { accessToken, fullName: isExistedUser.fullName }
  }

  static readonly forgotPassword = async (
    forgotPasswordDTO: DTO.IForgotPassword,
  ) => {
    const isExistedUser = await this.userRepository.findOne({
      filter: { email: forgotPasswordDTO.email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!isExistedUser) throw { msg: 'in-valid email', status: 400 }

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email: forgotPasswordDTO.email, type: OtpType.forgotPassword },
      projection: { _id: 1 },
      options: { lean: true },
    })

    if (isExistedOtp)
      return throwError({
        msg: 'code was already sent, check your e-mail or wait for 15m to request another code',
        status: 409,
      })

    await this.otpRepository.create({
      email: forgotPasswordDTO.email,
      type: OtpType.forgotPassword,
    })
  }

  static readonly resetPassword = async (
    resetPasswordDTO: DTO.IResetPassword,
  ) => {
    const { email, newPassword, otpCode } = resetPasswordDTO

    const isExistedUser = await this.userRepository.findOne({
      filter: { email },
      projection: { email: 1 },
      options: { lean: true },
    })

    if (!isExistedUser) throw { msg: 'in-valid email', status: 400 }

    const isExistedOtp = await this.otpRepository.findOne({
      filter: { email, type: OtpType.forgotPassword },
      projection: { _id: 1, otpCode: 1 },
      options: { lean: true },
    })

    if (!isExistedOtp)
      return throwError({ msg: 'code is expired', status: 400 })

    const isMatchedOtp = compareValues({
      value: otpCode,
      hashedValue: isExistedOtp.otpCode,
    })

    if (!isMatchedOtp)
      return throwError({ msg: 'code is in-valid', status: 400 })

    await this.userRepository.findByIdAndUpdate({
      _id: isExistedUser._id,
      data: {
        password: newPassword,
        changedCredentialsAt: Date.now(),
      },
      options: {
        lean: true,
        new: true,
      },
    })
  }
}
