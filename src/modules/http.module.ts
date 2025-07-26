import { Router } from 'express'
import { applyRateLimiter } from '../common/utils/security/rate-limiter/rate-limiter'
import { applyGuards } from '../common/decorators/guard/apply-guards.decorator'

import authModule from './auth/auth.module'
import userModule from './user/user.module'
import noteModule from './note/http/note.module'

import isAuthenticatedGuard from '../common/guards/auth/is-authenticated.guard'
import isAuthorizedGuard from '../common/guards/auth/is-authorized.guard'

const router: Router = Router()

router.use(
  '/auth',
  applyRateLimiter({ skipSuccessfulRequests: true }),
  authModule,
)

router.use(
  '/user',
  applyRateLimiter({ skipSuccessfulRequests: true }),
  applyGuards([isAuthenticatedGuard, isAuthorizedGuard]),
  userModule,
)

router.use(
  '/notes',
  applyRateLimiter({ skipSuccessfulRequests: false }),
  applyGuards([isAuthenticatedGuard, isAuthorizedGuard]),
  noteModule,
)

export default router
