import { INote } from '../../../../db/interface/INote.interface'
import { returnedType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { singleNote } from './note-fields.type'

import { GraphQLInt, GraphQLList } from 'graphql'

export class NoteResponse {
  static readonly getAll = () => {
    return returnedType<{
      documents: INote[]
      pageSize: number
      count: number
      pages: number
    }>({
      name: 'getAllResponse',
      fields: {
        documents: {
          type: new GraphQLList(singleNote),
        },
        pageSize: { type: GraphQLInt },
        pages: { type: GraphQLInt },
        count: { type: GraphQLInt },
      },
    })
  }
}
