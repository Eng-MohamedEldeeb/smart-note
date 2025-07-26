import { GraphQLScalarType } from 'graphql'

export const DateType = new GraphQLScalarType({
  name: 'Date',
  parseValue(value) {
    return new Date(value as string)
  },
  serialize(value) {
    const v = value as number
    return new Date(v).toISOString()
  },
})

export type GraphFields<T> = { [K in keyof T]: { type: any } }
