import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common'
import { CommandBus } from '@nestjs/cqrs'
import { RegisterDto } from './core/dtos'
import { AC } from './commands'

@Controller('auth')
export class AuthController {
	constructor(private readonly commandBus: CommandBus) {}

	@Post('register')
	@HttpCode(HttpStatus.NO_CONTENT)
	public async register(@Body() dto: RegisterDto): Promise<void> {
		await this.commandBus.execute(new AC.RegisterCommand(dto))
	}
}
