import { GraphQLInt, GraphQLObjectType, GraphQLString } from 'graphql'

import { GraphFields } from '../../types/graphql/graphql.types'

export const argsType = <Interface>(fields: GraphFields<Interface>) => {
  return fields
}

export const returnedType = <Interface>({
  name,
  fields,
}: {
  name: string
  fields: GraphFields<Interface>
}) => {
  return new GraphQLObjectType({
    name,
    fields,
  })
}

export const returnedResponseType = ({
  name,
  data,
}: {
  name: string

  data?: any
}) => {
  return returnedType({
    name,
    fields: {
      status: { type: GraphQLInt },
      ...(data && { data: { type: data } }),
    },
  })
}
