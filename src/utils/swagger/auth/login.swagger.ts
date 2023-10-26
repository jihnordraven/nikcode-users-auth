import { HttpStatus, applyDecorators } from '@nestjs/common'
import { ApiBody, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger'

class LoginBody {
	@ApiProperty()
	readonly emailOrLogin: string

	@ApiProperty()
	readonly password: string
}

export const SwaggerToLogin = (): MethodDecorator => {
	return applyDecorators(
		ApiOperation({ summary: 'User login with local credentials' }),

		ApiBody({
			type: LoginBody,
			examples: {
				withEmail: {
					value: {
						emailOrLogin: 'example@gmail.com',
						password: 'Password123%'
					}
				},
				withLogin: {
					value: {
						emailOrLogin: 'example-username',
						password: 'Password123%'
					}
				}
			}
		}),

		ApiResponse({
			status: HttpStatus.OK,
			description:
				'User logged in successfully. Sent access token in body and refresh token in cookies'
		}),
		ApiResponse({
			status: HttpStatus.UNAUTHORIZED,
			description: 'Invalid emailOrLogin or password'
		}),
		ApiResponse({
			status: HttpStatus.INTERNAL_SERVER_ERROR,
			description: 'Fatall error on the server side'
		})
	)
}
