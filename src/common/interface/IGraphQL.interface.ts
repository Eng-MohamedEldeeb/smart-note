import {
  GraphQLFieldConfigArgumentMap,
  GraphQLOutputType,
  GraphQLResolveInfo,
} from 'graphql'

import { IUser } from '../../db/interface/IUser.interface'
import { IPayload } from '../utils/security/token/interface/token.interface'
import { GuardActivator } from '../guards/can-activate.guard'
import { INote } from '../../db/interface/INote.interface'

export type ControllerParams = (
  args: any,
  context: IContext,
) => Promise<any> | any

export type ResolverParams = (
  source: any,
  args: any,
  context: IContext,
  info: GraphQLResolveInfo,
) => Promise<any> | any

export interface IResolveArgs {
  resolver: ControllerParams
  guards?: GuardActivator[]
  middlewares?: ResolverParams[]
}

export interface IResolver {
  type: GraphQLOutputType
  resolve: (
    s: any,
    args: any,
    context: IContext,
    info: GraphQLResolveInfo,
  ) => any
}

export interface IQueryController extends IResolver {
  args?: GraphQLFieldConfigArgumentMap
}

export interface IMutationController extends IResolver {
  args: GraphQLFieldConfigArgumentMap
}

export interface ISuccessResponse {
  status?: 200 | 201
  data?: any
}

export interface IContext {
  authorization: string
  tokenPayload: IPayload
  user: IUser
  note: INote
}
