import { IQueryController } from '../../../common/interface/IGraphQL.interface'
import { validate } from '../../../common/middlewares/validation/validation.middleware'
import { returnedResponseType } from '../../../common/decorators/resolver/returned-type.decorator'
import { applyResolver } from '../../../common/decorators/resolver/apply-resolver.decorator'
import { NoteQueryResolver } from './note.resolver'
import { NoteResponse } from './types/note-response.type'

import * as args from './types/note-args.type'
import * as validators from './../validator/note.validator'

import isAuthenticatedGuard from '../../../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../../../common/guards/auth/is-authorized.guard'

export class NoteController {
  private static readonly NoteQueryResolver = NoteQueryResolver

  static readonly getAll = (): IQueryController => {
    return {
      type: returnedResponseType({
        name: 'getAllNotesQuery',
        data: NoteResponse.getAll(),
      }),
      args: args.getAll,
      resolve: applyResolver({
        middlewares: [validate(validators.getAllValidator)],
        guards: [isAuthenticatedGuard, isAuthorizedGuard],
        resolver: this.NoteQueryResolver.getAll,
      }),
    }
  }
}
