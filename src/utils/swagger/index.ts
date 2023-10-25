import { SwaggerToLogin } from './auth/login.swagger'
import { SwaggerToLogout } from './auth/logout.swagger'
import { SwaggerToRefresh } from './auth/refresh.swagger'
import { SwaggerToRegister } from './auth/register.swagger'

export * from './swagger.config'

export const SWAGGER_AUTH = {
	SwaggerToRegister,
	SwaggerToLogin,
	SwaggerToRefresh,
	SwaggerToLogout
}
