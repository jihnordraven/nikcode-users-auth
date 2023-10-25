import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { UsersRepo } from './repositories/users.repo'

@Module({
	controllers: [UsersController],
	providers: [UsersService, UsersRepo],
	exports: [UsersService, UsersRepo]
})
export class UsersModule {}
