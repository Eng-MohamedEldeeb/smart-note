import { GraphQLResolveInfo } from 'graphql'
import { asyncHandler } from '../async-handler/async-handler.decorator'
import { applyGuards } from '../guard/apply-guards.decorator'

import { IContext, IResolveArgs } from '../../interface/IGraphQL.interface'

export const applyResolver = ({
  resolver,
  guards,
  middlewares,
}: IResolveArgs) => {
  return asyncHandler(
    async (_: any, args: any, context: IContext, __: GraphQLResolveInfo) => {
      if (middlewares?.length)
        for (const middleware of middlewares) {
          await middleware(_, args, context, __)
        }

      if (guards?.length)
        await applyGuards(guards).apply(this, [_, args, context, __])

      return resolver(args, context)
    },
  )
}
