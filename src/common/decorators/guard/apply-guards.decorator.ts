import { asyncHandler } from '../async-handler/async-handler.decorator'
import { ContextDetector } from '../context/context-detector.decorator'
import { GuardActivator } from '../../guards/can-activate.guard'
import { ContextType } from '../context/types/enum/context-type.enum'
import { throwError } from '../../handlers/error-message.handler'

import {
  graphQlContextGuardsActivator,
  httpContextGuardsActivator,
} from './helpers/apply-guards.helper'

export const applyGuards = (guards: GuardActivator[]) => {
  return asyncHandler(async (...params: any[]) => {
    const Ctx = ContextDetector.detect(params)
    if (Ctx.type === ContextType.httpContext) {
      return await httpContextGuardsActivator(Ctx, guards)
    }

    if (Ctx.type === ContextType.graphContext) {
      return await graphQlContextGuardsActivator(Ctx, guards)
    }
  })
}
