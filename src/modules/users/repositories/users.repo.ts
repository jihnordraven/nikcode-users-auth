import {
	Inject,
	Injectable,
	InternalServerErrorException,
	Logger,
	NotFoundException
} from '@nestjs/common'
import { PrismaService } from '../../../../prisma/prisma.service'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { User } from '@prisma/client'
import { UserTTL } from '../../../utils/constants'
import { CreateUser } from '../core/types'
import { red } from 'colorette'

@Injectable()
export class UsersRepo {
	private readonly logger: Logger = new Logger(UsersRepo.name)

	constructor(
		@Inject(CACHE_MANAGER) private readonly cache: Cache,
		private readonly prisma: PrismaService
	) {}

	public async create(data: CreateUser): Promise<User> {
		const user: User = await this.prisma.user
			.create({ data })
			.catch((err: string) => {
				this.logger.error(red(err))
				throw new InternalServerErrorException('Unable to create a new user')
			})

		await this.setCache(user)
		return user
	}

	public async findByEmailOrLogin(emailOrLogin: string): Promise<User | null> {
		const user: User | null = await this.cache.get<User | null>(
			`user-emailOrLogin-${emailOrLogin}`
		)
		if (!user) {
			const user: User | null = await this.prisma.user.findFirst({
				where: { OR: [{ email: emailOrLogin }, { login: emailOrLogin }] }
			})
			if (!user) return null
			await this.setCache(user)
			return user
		}
		return user
	}

	public async findByEmail(email: string): Promise<User | null> {
		const user: User | null = await this.cache.get<User | null>(`user-email-${email}`)
		if (!user) {
			const user: User | null = await this.prisma.user.findUnique({
				where: { email }
			})
			if (!user) return null
			await this.setCache(user)
			return user
		}
		return user
	}

	public async findByLogin(login: string): Promise<User | null> {
		const user: User | null = await this.cache.get<User | null>(`user-login-${login}`)
		if (!user) {
			const user: User | null = await this.prisma.user.findUnique({
				where: { login }
			})
			if (!user) return null
			await this.setCache(user)
			return user
		}
		return user
	}

	public async findById(id: string): Promise<User | null> {
		const user: User | null = await this.cache.get<User | null>(`user-id-${id}`)
		if (!user) {
			const user: User | null = await this.prisma.user.findUnique({
				where: { id }
			})
			if (!user) return null
			await this.setCache(user)
			return user
		}
		return user
	}

	public async delete(id: string): Promise<void> {
		const user: User | null = await this.findById(id)
		if (!user) throw new NotFoundException('User not found')
		await this.cleanCache(user)

		await this.prisma.user.delete({ where: { id } })
	}

	// Helpers
	private async setCache(user: User): Promise<void> {
		await this.cache.set(`user-emailOrLogin-${user.email}`, user, UserTTL)
		await this.cache.set(`user-email-${user.email}`, user, UserTTL)
		await this.cache.set(`user-login-${user.login}`, user, UserTTL)
		await this.cache.set(`user-id-${user.id}`, user, UserTTL)
	}

	private async cleanCache(user: User): Promise<void> {
		await this.cache.del(`user-email-${user.email}`)
		await this.cache.del(`user-login-${user.login}`)
		await this.cache.del(`user-id-${user.id}`)
	}
}
