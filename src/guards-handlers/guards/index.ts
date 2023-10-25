import { JwtAccessGuard } from './jwt-access.guard'
import { JwtRefreshGuard } from './jwt-refresh.guard'
import { LocalGuard } from './local.guard'

export const GUARDS = { LocalGuard, JwtAccessGuard, JwtRefreshGuard }
