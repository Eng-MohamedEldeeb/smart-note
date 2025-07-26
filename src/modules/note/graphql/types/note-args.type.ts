import { GraphQLInt, GraphQLString } from 'graphql'

import { argsType } from '../../../../common/decorators/resolver/returned-type.decorator'
import { IGetNotesQueryDto } from '../../dto/note.dto'

export const getAll = argsType<IGetNotesQueryDto>({
  search: { type: GraphQLString },
  page: { type: GraphQLInt },
  limit: { type: GraphQLInt },
  sort: { type: GraphQLInt },
})
