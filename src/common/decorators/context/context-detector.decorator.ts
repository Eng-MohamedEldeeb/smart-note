import { ContextType } from './types/enum/context-type.enum'

import {
  HttpContext,
  HttpParams,
  GraphQLContext,
  GraphQLParams,
} from './types/context-detector.types'

export class ContextDetector {
  protected static params: any[any]
  public static type: ContextType

  static readonly detect = (params: any[]) => {
    this.params = params

    if (this.hasHttpParams()) {
      this.type = ContextType.httpContext
      return this
    }

    if (this.hasGraphQLParams()) {
      this.type = ContextType.graphContext
      return this
    }

    throw new Error('Un-known Context')
  }

  private static readonly hasHttpParams = (): boolean => {
    return (
      this.params.length === 3 &&
      'url' in this.params[0] &&
      this.params[this.params.length - 1] instanceof Function
    )
  }

  private static readonly hasGraphQLParams = (): boolean => {
    return this.params.length === 4 && 'fieldName' in this.params[3]
  }

  static readonly switchToHTTP = <P = any, Q = any>(): HttpContext<P, Q> => {
    const [req, res, next]: HttpParams<P, Q> = this.params

    return { req, res, next }
  }

  static readonly switchToGraphQL = <Args = any>(): GraphQLContext<Args> => {
    const [source, args, context, info]: GraphQLParams<Args> = this.params

    return { source, args, context, info }
  }
}
