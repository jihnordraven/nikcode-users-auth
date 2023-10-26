import { LoginCommand } from './login/login.command'
import { LoginHandler } from './login/login.handler'
import { LogoutCommand } from './logout/logout.command'
import { LogoutHandler } from './logout/logout.handler'
import { RegisterCommand } from './register/register.command'
import { RegisterHandler } from './register/register.handler'

export const AC = { RegisterCommand, LoginCommand, LogoutCommand }

export const ACH = [RegisterHandler, LoginHandler, LogoutHandler]
