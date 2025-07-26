import { GraphQLID, GraphQLString } from 'graphql'

import {
  DateType,
  GraphFields,
} from '../../../../common/types/graphql/graphql.types'

import { INote } from '../../../../db/interface/INote.interface'
import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'

export const noteFields: GraphFields<Omit<INote, '__v'>> = {
  _id: { type: GraphQLID },
  createdAt: { type: DateType },
  updatedAt: { type: DateType },
  title: { type: GraphQLString },
  body: { type: GraphQLString },
  createdBy: { type: GraphQLString },
}

export const singleNote = returnedType<Omit<INote, '__v'>>({
  name: 'singleNote',
  fields: noteFields,
})
