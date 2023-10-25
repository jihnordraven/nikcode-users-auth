import {
	ForbiddenException,
	HttpStatus,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Session, User } from '@prisma/client'
import { Strategy } from 'passport-jwt'
import { JWT_CONFIG } from '../../config'
import { Request } from 'express'
import { REFRESH_TOKEN } from '../../utils/constants'
import { SessionsService } from '../../modules/sessions/sessions.service'
import { UsersRepo } from '../../modules/users/repositories/users.repo'

export type JwtRefreshPayload = {
	userId: string
	sessionId: string
	iat: number
	exp: number
}

const ExtractJwtFromCookies = (req: Request) => req.cookies[REFRESH_TOKEN]

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
	constructor(
		private readonly sessionsService: SessionsService,
		private readonly usersRepo: UsersRepo
	) {
		super({
			jwtFromRequest: (req: Request) => ExtractJwtFromCookies(req),
			secretOrKey: JWT_CONFIG.JWT_REFRESH_SECRET,
			ignoreExpiration: false
		})
	}

	public async validate(payload: JwtRefreshPayload): Promise<JwtRefreshPayload> {
		const session: Session | null = await this.sessionsService.validateSession(
			payload.sessionId
		)
		if (!session)
			throw new ForbiddenException({
				message: 'Session was deleted. Please log in again'
			})

		const user: User | null = await this.usersRepo.findById(payload.userId)
		if (!user)
			throw new UnauthorizedException({
				message: 'User might was deleted',
				error: 'Unauthorized',
				status: HttpStatus.UNAUTHORIZED
			})

		return payload
	}
}
