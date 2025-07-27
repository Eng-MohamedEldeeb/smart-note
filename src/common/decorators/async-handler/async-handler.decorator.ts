import { ContextType } from '../context/types/enum/context-type.enum'
import { ContextDetector } from '../context/context-detector.decorator'

import { oneError } from './helpers/on-error.helpers'

export const asyncHandler = (fn: Function) => {
  return async (...params: any[]) => {
    const Ctx = ContextDetector.detect(params)

    try {
      if (Ctx.type === ContextType.httpContext) {
        const { req, res, next } = Ctx.switchToHTTP()
        return await fn(req, res, next)
      }

      if (Ctx.type === ContextType.graphContext) {
        const { source, args, context, info } = Ctx.switchToGraphQL()
        return await fn(source, args, context, info)
      }
    } catch (error) {
      if (Ctx.type === ContextType.httpContext) {
        const { req } = Ctx.switchToHTTP()
      }

      oneError(error, Ctx)
    }
  }
}
