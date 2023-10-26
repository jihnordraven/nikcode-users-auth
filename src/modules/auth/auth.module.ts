import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { ACH } from './commands'
import { CqrsModule } from '@nestjs/cqrs'
import { UsersModule } from '../users/users.module'
import { SessionsModule } from '../sessions/sessions.module'
import { JwtModule } from '@nestjs/jwt'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule, ConfigService } from '@nestjs/config'
import {
	MAILER_SERVICE,
	PAYMENTS_SERVICE
} from '../../utils/constants/services.constants'

@Module({
	imports: [
		CqrsModule,
		JwtModule,
		ClientsModule.registerAsync([
			{
				inject: [ConfigService],
				name: PAYMENTS_SERVICE,
				useFactory: async (config: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [config.getOrThrow<string>('RMQ_HOST')],
						queue: config.getOrThrow<string>('RMQ_PAYMENTS_QUEUE'),
						queueOptions: {
							durable: true
						}
					}
				})
			},
			{
				inject: [ConfigService],
				name: MAILER_SERVICE,
				useFactory: async (config: ConfigService) => ({
					transport: Transport.RMQ,
					options: {
						urls: [config.getOrThrow<string>('RMQ_HOST')],
						queue: config.getOrThrow<string>('RMQ_MAILER_QUEUE'),
						queueOptions: {
							durable: true
						}
					}
				})
			}
		]),
		UsersModule,
		SessionsModule
	],
	controllers: [AuthController],
	providers: [AuthService, ...ACH]
})
export class AuthModule {}
