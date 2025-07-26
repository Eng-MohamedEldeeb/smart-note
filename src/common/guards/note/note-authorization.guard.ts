import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { MongoId } from '../../types/db/db.types'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

class NoteAuthorizationGuard extends GuardActivator {
  protected userId!: MongoId
  protected createdBy!: MongoId

  protected readonly isTheOwner = async () => {
    return this.createdBy.equals(this.userId)
  }

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()

      this.createdBy = req.note.createdBy as MongoId
      this.userId = req.user._id
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()

      this.createdBy = context.note.createdBy as MongoId
      this.userId = context.user._id
    }

    return this.isTheOwner()
  }
}

export default new NoteAuthorizationGuard()
