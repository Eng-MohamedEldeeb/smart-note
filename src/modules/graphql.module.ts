import { createHandler } from 'graphql-http/lib/use/express'

import * as note from './note/graphql/note.module'

import { GraphQLError, GraphQLObjectType, GraphQLSchema } from 'graphql'

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: 'mainRootQuery',
    fields: {
      note: note.queryModule(),
    },
  }),
})

const graphqlModule = createHandler({
  schema,
  context: function (req, _) {
    const { authorization } = req.raw.headers

    return { authorization }
  },
  formatError(err) {
    return new GraphQLError(err.message, { originalError: err })
  },
})

export default graphqlModule
