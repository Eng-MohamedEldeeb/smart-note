import { IMongoDoc } from './IMongo-doc.interface'

export interface IUserInputs {
  fullName: string

  email: string
  password: string
  confirmPassword: string

  birthDate: Date
  phone: string

  otpCode: string
}

export interface IUser
  extends IMongoDoc,
    Omit<IUserInputs, 'confirmPassword' | 'otpCode'> {
  avatar: string

  age: number

  changedCredentialsAt?: Date
  loggedOutAt?: Date
}
