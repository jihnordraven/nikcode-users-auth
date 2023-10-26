import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersRepo } from './repositories/users.repo'

@Module({
	providers: [UsersService, UsersRepo],
	exports: [UsersService, UsersRepo]
})
export class UsersModule {}
