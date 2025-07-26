import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { throwError } from '../../handlers/error-message.handler'
import { MongoId } from '../../types/db/db.types'

import { INoteIdDto } from '../../../modules/note/dto/note.dto'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import noteRepository from '../../repositories/note.repository'

class NoteExistenceGuard extends GuardActivator {
  private readonly noteRepository = noteRepository
  protected noteId!: MongoId
  protected id!: MongoId

  protected readonly isExistedNote = async () => {
    const isExistedNote = await this.noteRepository.findOne({
      filter: { $or: [{ _id: this.id }, { _id: this.noteId }] },
      options: { lean: true },
    })

    if (!isExistedNote)
      return throwError({
        msg: 'Un-Existed Note or In-valid Id',
        status: 404,
      })
    return isExistedNote
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP<INoteIdDto, INoteIdDto>()
      const { id } = { ...req.params, ...req.query }

      this.noteId = id
      this.id = id

      req.note = await this.isExistedNote()

      return true
    }

    if (Ctx.type === ContextType.graphContext) {
      const { args, context } = Ctx.switchToGraphQL<INoteIdDto>()
      const { id } = args

      this.noteId = id
      this.id = id

      context.note = await this.isExistedNote()

      return true
    }
  }
}

export default new NoteExistenceGuard()
