import { HttpStatus, applyDecorators } from '@nestjs/common'
import { ApiCookieAuth, ApiOperation, ApiResponse } from '@nestjs/swagger'
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../../constants'

export const SwaggerToRefresh = (): MethodDecorator => {
	return applyDecorators(
		ApiOperation({ summary: 'Get new tokens by the old refresh one' }),

		ApiCookieAuth(REFRESH_TOKEN),

		ApiResponse({
			status: HttpStatus.OK,
			description: `Success. Returns ${ACCESS_TOKEN} in body and ${REFRESH_TOKEN} in cookies`
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
