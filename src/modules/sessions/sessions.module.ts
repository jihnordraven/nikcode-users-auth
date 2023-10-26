import { Module } from '@nestjs/common'
import { SessionsService } from './sessions.service'
import { SessionsRepo } from './repositories/sessions.repo'

@Module({
	providers: [SessionsService, SessionsRepo],
	exports: [SessionsService, SessionsRepo]
})
export class SessionsModule {}
