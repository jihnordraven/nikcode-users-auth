import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { LogoutCommand } from './logout.command'
import { SessionsRepo } from '../../../sessions/repositories/sessions.repo'

@CommandHandler(LogoutCommand)
export class LogoutHandler implements ICommandHandler<LogoutCommand> {
	constructor(protected readonly sessionsRepo: SessionsRepo) {}

	public async execute({ input }: LogoutCommand): Promise<void> {
		const { sessionId } = input

		await this.sessionsRepo.delete(sessionId)
	}
}
