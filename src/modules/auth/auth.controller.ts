import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Ip,
	Post,
	Req,
	Res,
	UseGuards
} from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { RegisterDto } from './core/dtos'
import { AC } from './commands'
import { CurrentUser, UserAgent } from '../../utils/decorators'
import { Request, Response } from 'express'
import { ITokens } from '../../utils/interfaces'
import { LocalGuard } from '../../guards-handlers/guards/local.guard'
import { REFRESH_TOKEN } from '../../utils/constants'
import { ConfigService } from '@nestjs/config'
import { JwtRefreshGuard } from '../../guards-handlers/guards/jwt-refresh.guard'
import { JwtRefreshPayload } from 'src/guards-handlers/strategies/jwt-refresh.strategy'
import { ApiTags } from '@nestjs/swagger'
import { SWAGGER_AUTH } from 'src/utils/swagger'

@ApiTags('Auth endpoints')
@Controller('auth')
export class AuthController {
	constructor(
		private readonly commandBus: CommandBus,
		private readonly config: ConfigService
	) {}

	@SWAGGER_AUTH.SwaggerToRegister()
	@Post('register')
	@HttpCode(HttpStatus.NO_CONTENT)
	public async register(@Body() dto: RegisterDto): Promise<void> {
		await this.commandBus.execute(new AC.RegisterCommand(dto))
	}

	@SWAGGER_AUTH.SwaggerToLogin()
	@Post('login')
	@HttpCode(HttpStatus.OK)
	@UseGuards(LocalGuard)
	public async login(
		@CurrentUser('id') userId: string,
		@UserAgent() userAgent: string,
		@Ip() userIp: string,
		@Res() res: Response
	): Promise<void> {
		const tokens: ITokens = await this.commandBus.execute(
			new AC.LoginCommand({ userId, userIp, userAgent })
		)
		this.setTokensToResponse(tokens, res)
	}

	@SWAGGER_AUTH.SwaggerToRefresh()
	@Post('refresh')
	@UseGuards(JwtRefreshGuard)
	public async refresh(
		@Req() req: Request,
		@Res() res: Response,
		@Ip() userIp: string,
		@UserAgent() userAgent: string
	): Promise<void> {
		const { userId, sessionId } = req.user as JwtRefreshPayload
		await this.commandBus.execute(new AC.LogoutCommand({ userId, sessionId }))

		const tokens: ITokens = await this.commandBus.execute(
			new AC.LoginCommand({
				userId,
				userIp,
				userAgent
			})
		)
		this.setTokensToResponse(tokens, res)
	}

	@SWAGGER_AUTH.SwaggerToLogout()
	@Post('logout')
	@UseGuards(JwtRefreshGuard)
	public async logout(@Req() req: Request, @Res() res: Response): Promise<void> {
		const { userId, sessionId } = req.user as JwtRefreshPayload

		await this.commandBus.execute(new AC.LogoutCommand({ userId, sessionId }))

		res.clearCookie(REFRESH_TOKEN).end()
	}

	// Helpers
	private setTokensToResponse(tokens: ITokens, res: Response): void {
		const MODE: string = this.config.getOrThrow<string>('MODE')

		res.cookie(REFRESH_TOKEN, tokens.refreshToken, {
			httpOnly: true,
			secure: MODE === 'dev' ? false : true
		}).json({ accessToken: tokens.accessToken })
	}
}
