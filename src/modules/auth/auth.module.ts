import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ACH } from './commands'
import { CqrsModule } from '@nestjs/cqrs'
import { UsersModule } from '../users/users.module'
import { SessionsModule } from '../sessions/sessions.module'
import { JwtModule } from '@nestjs/jwt'

@Module({
	imports: [CqrsModule, JwtModule, UsersModule, SessionsModule],
	controllers: [AuthController],
	providers: [AuthService, ...ACH]
})
export class AuthModule {}