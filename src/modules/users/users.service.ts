import {
	ForbiddenException,
	HttpStatus,
	Injectable,
	UnauthorizedException
} from '@nestjs/common'
import { User } from '@prisma/client'
import { UsersRepo } from './repositories/users.repo'
import { compare } from 'bcrypt'

@Injectable()
export class UsersService {
	constructor(private readonly usersRepo: UsersRepo) {}

	public async validateByCredentials(
		emailOrLogin: string,
		passw: string
	): Promise<User | null> {
		if (!emailOrLogin || !passw) return null

		const user: User | null = await this.usersRepo.findByEmailOrLogin(emailOrLogin)
		if (!user) return null

		if (user.isBlocked)
			throw new ForbiddenException({
				message: 'Your account has been blocked',
				error: 'Forbidden',
				status: HttpStatus.FORBIDDEN,
				context: 'user-blocked'
			})

		const isValidPassw: boolean = await compare(passw, user.hashPassw)
		if (!isValidPassw) return null

		return user
	}

	public async validateById(id: string): Promise<User | null> {
		if (!id) return null

		const user: User | null = await this.usersRepo.findById(id)
		if (!user) return null

		if (user.isBlocked)
			throw new ForbiddenException({
				message: 'Your account has been blocked',
				error: 'Forbidden',
				status: HttpStatus.FORBIDDEN,
				context: 'user-blocked'
			})

		return user
	}
}
