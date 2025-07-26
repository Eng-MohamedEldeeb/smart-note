import { Schema, UpdateQuery } from 'mongoose'

import * as regex from './../../../common/validation/regex'

import { IUser } from '../../interface/IUser.interface'
import { OtpType } from '../../enums/otp.enum'
import { hashValue } from '../../../common/utils/security/hash/security.service'
import { encryptValue } from '../../../common/utils/security/crypto/crypto.service'

import otpRepository from '../../../common/repositories/otp.repository'
import noteRepository from '../../../common/repositories/note.repository'

export const UserSchema = new Schema<IUser>(
  {
    avatar: {
      type: String,
    },

    fullName: {
      type: String,
      required: [true, 'fullName is required'],
      trim: true,
    },

    email: {
      type: String,
      required: [true, 'email is required'],
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
      validate: {
        validator: regex.validate(regex.phonePattern),
        message: 'In-valid phone number',
      },
    },

    password: {
      type: String,
      required: [true, 'password is required'],
      trim: true,
      validate: {
        validator: regex.validate(regex.passwordPattern),
        message:
          'In-valid password, password must contain capital, small letters and numbers',
      },
    },

    age: {
      type: Number,
      required: [true, 'birthDate is required'],
      min: 15,
    },

    changedCredentialsAt: {
      type: Date,
    },

    loggedOutAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
)

UserSchema.virtual('birthDate').set(function (v) {
  return this.set('age', new Date().getFullYear() - new Date(v).getFullYear())
})

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) this.password = hashValue(this.password)
  if (this.isModified('phone')) this.phone = encryptValue(this.phone!)

  return next()
})

UserSchema.post('save', async function (res) {
  const userDoc: Pick<IUser, 'email'> = res
  await otpRepository.findOneAndDelete({
    filter: {
      email: userDoc.email,
      type: OtpType.confirmRegistration,
    },
  })
})

UserSchema.pre('findOneAndUpdate', async function (next) {
  const updatedData: UpdateQuery<IUser> | null = this.getUpdate()
  const keys = Object.keys(updatedData ?? {}) as (keyof IUser)[]

  if (!updatedData) return next()

  if (keys.includes('password'))
    this.setUpdate({
      password: hashValue(updatedData.password),
      $set: {
        changedCredentialsAt: Date.now(),
      },
    })

  if (keys.includes('phone'))
    this.setUpdate({
      phone: encryptValue(updatedData.phone),
    })

  if (keys.includes('email'))
    this.setUpdate({
      tempEmail: encryptValue(updatedData.email),
    })

  return next()
})

UserSchema.post('findOneAndDelete', async function ({ _id, avatar }: IUser) {
  Promise.allSettled([noteRepository.deleteMany({ createdBy: _id })])
})
