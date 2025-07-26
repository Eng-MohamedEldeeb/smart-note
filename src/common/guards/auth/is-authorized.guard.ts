import { GuardActivator } from '../can-activate.guard'
import { ContextDetector } from '../../decorators/context/context-detector.decorator'
import { ContextType } from '../../decorators/context/types/enum/context-type.enum'
import { IContext } from '../../interface/IGraphQL.interface'
import { IRequest } from '../../interface/IRequest.interface'
import { IPayload } from '../../utils/security/token/interface/token.interface'
import { throwError } from '../../handlers/error-message.handler'

import {
  GraphQLParams,
  HttpParams,
} from '../../decorators/context/types/context-detector.types'

import userRepository from '../../repositories/user.repository'

class IsAuthorizedGuard implements GuardActivator {
  private readonly userRepository = userRepository
  protected changedCredentialsAt!: Date
  protected loggedOutAt!: Date
  protected tokenPayload!: IPayload

  async canActivate(...params: HttpParams | GraphQLParams) {
    const Ctx = ContextDetector.detect(params)

    if (Ctx.type === ContextType.httpContext) {
      const { req } = Ctx.switchToHTTP()
      return await this.httpAuthorization(req)
    }

    if (Ctx.type === ContextType.graphContext) {
      const { context } = Ctx.switchToGraphQL()
      return await this.graphQLAuthorization(context)
    }
  }

  protected readonly isExpiredToken = (): boolean => {
    if (this.changedCredentials() || this.isLoggedOut()) return true

    return false
  }

  protected readonly changedCredentials = () => {
    const { iat } = this.tokenPayload

    if (iat && this.changedCredentialsAt)
      return iat < Math.ceil(this.changedCredentialsAt.getTime() / 1000)
  }

  protected readonly isLoggedOut = () => {
    const { iat } = this.tokenPayload

    if (iat && this.changedCredentialsAt)
      return iat < Math.ceil(this.loggedOutAt.getTime() / 1000)
  }

  protected readonly httpAuthorization = async (req: IRequest) => {
    this.tokenPayload = req.tokenPayload

    const isExistedUser = await this.userRepository.findOne({
      filter: { _id: this.tokenPayload._id },

      projection: { password: 0 },

      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: 'un-authenticated user', status: 403 })

    if (isExistedUser.changedCredentialsAt)
      this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    if (isExistedUser.loggedOutAt) this.loggedOutAt = isExistedUser.loggedOutAt

    const isExpiredToken = this.isExpiredToken()

    if (isExpiredToken)
      return throwError({ msg: 're-login is required', status: 403 })

    req.user = isExistedUser

    return true
  }

  protected readonly graphQLAuthorization = async (context: IContext) => {
    this.tokenPayload = context.tokenPayload

    const isExistedUser = await this.userRepository.findOne({
      filter: { _id: this.tokenPayload._id },

      projection: { password: 0 },

      options: { lean: true },
    })

    if (!isExistedUser)
      return throwError({ msg: 'un-authenticated user', status: 403 })

    if (isExistedUser.changedCredentialsAt)
      this.changedCredentialsAt = isExistedUser.changedCredentialsAt

    if (isExistedUser.loggedOutAt) this.loggedOutAt = isExistedUser.loggedOutAt

    const isExpiredToken = this.isExpiredToken()

    if (isExpiredToken)
      return throwError({ msg: 're-login is required', status: 403 })

    context.user = isExistedUser

    return context
  }
}

export default new IsAuthorizedGuard()
