import { GraphQLID, GraphQLInt, GraphQLList, GraphQLString } from 'graphql'

import { DateType, GraphFields } from './graphql.types'

import { IUser } from '../../../db/interface/IUser.interface'

export const userFields = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },
  fullName: GraphQLString,
  username: GraphQLString,
  email: GraphQLString,
  password: GraphQLString,
  birthDate: DateType,
  phone: GraphQLString,
  bio: GraphQLString,
  age: GraphQLInt,
  changedCredentialsAt: DateType,
}

export const userProfileFields: GraphFields<
  Omit<IUser, 'deactivatedAt' | 'tempEmail' | 'password' | '__v'>
> = {
  _id: { type: GraphQLID },

  createdAt: { type: DateType },

  updatedAt: { type: DateType },

  fullName: {
    type: userFields.fullName,
  },

  email: {
    type: userFields.email,
  },

  age: {
    type: userFields.age,
  },

  birthDate: { type: userFields.birthDate },

  phone: { type: userFields.phone },

  changedCredentialsAt: { type: userFields.changedCredentialsAt },

  avatar: {
    type: GraphQLString,
  },
}

export const userProfile = userProfileFields
