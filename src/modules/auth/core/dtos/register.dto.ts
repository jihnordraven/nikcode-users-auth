import { IsNotEmpty, IsString, Matches } from 'class-validator'
import {
	EmailPattern,
	LoginPattern,
	PasswPattern
} from '../../../../errors-handlers/validation-patterns'

export class RegisterDto {
	@IsNotEmpty()
	@IsString()
	@Matches(EmailPattern())
	readonly email: string

	@IsNotEmpty()
	@IsString()
	@Matches(LoginPattern())
	readonly login: string

	@IsNotEmpty()
	@IsString()
	@Matches(PasswPattern())
	readonly passw: string
}
