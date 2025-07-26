import { ObjectSchema } from 'joi'
import { ContextDetector } from '../../../decorators/context/context-detector.decorator'
import { IRequest } from '../../../interface/IRequest.interface'
import { throwError } from '../../../handlers/error-message.handler'

export const validateHttpInputs = async (
  ctx: typeof ContextDetector,
  schema: Record<string, ObjectSchema>,
) => {
  const { req, next } = ctx.switchToHTTP()
  const errors = []

  for (const key of Object.keys(schema)) {
    const { error } = schema[key].validate(req[key as keyof IRequest], {
      abortEarly: false,
    })

    if (error) {
      errors.push({
        key,
        detail: error.details.map(e => ({
          message: e.message,
          ...(e.path?.length && { path: e.path }),
          type: e.type,
        })),
      })
    }
  }

  if (errors.length)
    return throwError({
      msg: 'validation error',
      details: errors,
      status: 400,
    })
  return next()
}

export const validateGraphQLInputs = async (
  ctx: typeof ContextDetector,
  schema: Record<string, ObjectSchema>,
) => {
  const { args } = ctx.switchToGraphQL()

  const errors = []

  const { error } = schema.args.validate(args, {
    abortEarly: false,
    allowUnknown: false,
  })

  if (error) {
    errors.push({
      args,
      detail: error.details.map(e => ({
        message: e.message,
        ...(e.path?.length && { path: e.path }),
        type: e.type,
      })),
    })
  }

  if (errors.length) throw { msg: 'validation error', extensions: { errors } }
}
