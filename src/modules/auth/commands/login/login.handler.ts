import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { LoginCommand } from './login.command'
import { SessionsRepo } from '../../../sessions/repositories/sessions.repo'
import { JwtService } from '@nestjs/jwt'
import { JWT_CONFIG } from '../../../../config'
import { ITokens } from '../../../../utils/interfaces'

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand> {
	constructor(
		protected readonly sessionsRepo: SessionsRepo,
		protected readonly jwt: JwtService
	) {}

	public async execute({ input }: LoginCommand): Promise<ITokens> {
		const { userId } = input

		const sessionId: string = await this.sessionsRepo.create(input)

		const accessToken: string = this.jwt.sign(
			{ userId },
			{
				secret: JWT_CONFIG.JWT_ACCESS_SECRET,
				expiresIn: Number(JWT_CONFIG.JWT_ACCESS_EXPIRES)
			}
		)

		const refreshToken: string = this.jwt.sign(
			{ userId, sessionId },
			{
				secret: JWT_CONFIG.JWT_REFRESH_SECRET,
				expiresIn: Number(JWT_CONFIG.JWT_REFRESH_EXPIRES)
			}
		)

		return { accessToken, refreshToken }
	}
}
