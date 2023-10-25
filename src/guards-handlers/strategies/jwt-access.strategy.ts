import {
	ForbiddenException,
	HttpStatus,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { User } from '@prisma/client'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { JWT_CONFIG } from '../../config'
import { UsersService } from '../../modules/users/users.service'

export type JwtAccessPayload = {
	userId: string
	iat: number
	exp: number
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(Strategy, 'jwt-access') {
	constructor(private readonly usersService: UsersService) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: JWT_CONFIG.JWT_ACCESS_SECRET,
			ignoreExpiration: false
		})
	}

	public async validate(payload: JwtAccessPayload): Promise<User> {
		const user: User | null = await this.usersService.validateById(payload.userId)

		if (!user)
			throw new UnauthorizedException({
				message: 'User might was deleted',
				error: 'Unauthorized',
				status: HttpStatus.UNAUTHORIZED
			})

		return user
	}
}
