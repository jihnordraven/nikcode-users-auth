import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AuthModule } from './modules/auth/auth.module'
import { SessionsModule } from './modules/sessions/sessions.module'
import { UsersModule } from './modules/users/users.module'
import { PrismaModule } from '../prisma/prisma.module'
import { CacheModule } from '@nestjs/cache-manager'
import { redisStore } from 'cache-manager-redis-yet'

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		CacheModule.registerAsync({
			isGlobal: true,
			inject: [ConfigService],
			useFactory: async (config: ConfigService) => ({
				store: await redisStore({
					password: config.getOrThrow<string>('REDIS_PASS'),
					socket: {
						host: config.getOrThrow<string>('REDIS_HOST'),
						port: config.getOrThrow<number>('REDIS_PORT')
					}
				})
			})
		}),
		PrismaModule,
		AuthModule,
		SessionsModule,
		UsersModule
	]
})
export class AppModule {}
