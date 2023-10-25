import { IsNotEmpty, IsString, Matches } from 'class-validator'
import {
	EmailPattern,
	LoginPattern,
	PasswPattern
} from '../../../../errors-handlers/validation-patterns'
import { ApiProperty } from '@nestjs/swagger'

export class RegisterDto {
	@ApiProperty({
		type: String,
		pattern: String(EmailPattern()),
		example: 'example@example.com'
	})
	@IsNotEmpty()
	@IsString()
	@Matches(EmailPattern())
	readonly email: string

	@ApiProperty({ type: String, pattern: String(LoginPattern()), example: 'example' })
	@IsNotEmpty()
	@IsString()
	@Matches(LoginPattern())
	readonly login: string

	@ApiProperty({
		type: String,
		pattern: String(PasswPattern()),
		example: 'Example123%'
	})
	@IsNotEmpty()
	@IsString()
	@Matches(PasswPattern())
	readonly passw: string
}
