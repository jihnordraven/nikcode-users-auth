import { HttpStatus, applyDecorators } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { REFRESH_TOKEN } from '../../constants'

export const SwaggerToLogout = (): MethodDecorator => {
	return applyDecorators(
		ApiOperation({ summary: `Logout user by ${REFRESH_TOKEN}` }),

		ApiCookieAuth(REFRESH_TOKEN),

		ApiResponse({
			status: HttpStatus.OK,
			description: `Success. Current session deleted. Remove ${REFRESH_TOKEN} from cookies`
		}),
		ApiResponse({
			status: HttpStatus.UNAUTHORIZED,
			description: `${REFRESH_TOKEN} is invalid, expired or missing`
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'The server is not responding'
		})
	)
}
