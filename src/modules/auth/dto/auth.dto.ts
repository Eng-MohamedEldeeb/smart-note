import { IUserInputs } from '../../../db/interface/IUser.interface'

export interface IConfirmEmail extends Pick<IUserInputs, 'email'> {}

export interface IRegister extends Omit<IUserInputs, 'isPrivateProfile'> {}

export interface ILogin extends Pick<IUserInputs, 'email' | 'password'> {}

export interface IForgotPassword extends Pick<IUserInputs, 'email'> {}

export interface IResetPassword
  extends Pick<IUserInputs, 'email' | 'confirmPassword' | 'otpCode'> {
  newPassword: string
}
