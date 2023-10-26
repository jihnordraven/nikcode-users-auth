import { PassportStrategy } from '@nestjs/passport'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { Strategy } from 'passport-local'
import { User } from '@prisma/client'
import { UsersService } from '../../modules/users/users.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private readonly usersService: UsersService) {
		super({
			usernameField: 'emailOrLogin'
		})
	}

	public async validate(emailOrLogin: string, passw: string): Promise<User> {
		const user: User | null = await this.usersService.validateByCredentials(
			emailOrLogin,
			passw
		)

		if (!user) throw new UnauthorizedException('Invalid login or password')

		return user
	}
}
