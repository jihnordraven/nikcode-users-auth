import { Inject, Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import { CreateSession } from '../core/types'
import { PrismaService } from '../../../../prisma/prisma.service'
import { Session } from '@prisma/client'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Cache } from 'cache-manager'
import { SessionTTL } from '../../../utils/constants'
import { add } from 'date-fns'
import { JWT_CONFIG } from '../../../config'
import { red } from 'colorette'

@Injectable()
export class SessionsRepo {
	private readonly logger: Logger = new Logger(SessionsRepo.name)

	constructor(
		@Inject(CACHE_MANAGER) private readonly cache: Cache,
		private readonly prisma: PrismaService
	) {}

	public async create(data: CreateSession): Promise<string> {
		const isUserAgent: Session | null = await this.findByUserAgent(data.userAgent)
		const sessionId: string = isUserAgent ? isUserAgent.id : ''

		const expiresIn: Date = add(new Date(), {
			seconds: +JWT_CONFIG.JWT_REFRESH_EXPIRES
		})

		const session: Session = await this.prisma.session
			.upsert({
				where: { id: sessionId },
				update: { expiresIn },
				create: {
					...data,
					expiresIn
				}
			})
			.catch((err: string) => {
				this.logger.error(red(err))
				throw new InternalServerErrorException('Unable to upsert a session')
			})

		await this.setCache(session)
		return session.id
	}

	public async findById(id: string): Promise<Session | null> {
		const session: Session | null = await this.cache.get<Session | null>(
			`session-id-${id}`
		)
		if (!session) {
			const session: Session | null = await this.prisma.session.findUnique({
				where: { id }
			})
			if (!session) return null
			await this.setCache(session)
			return session
		}
		return session
	}

	public async findByUserAgent(userAgent: string): Promise<Session | null> {
		const session: Session | null = await this.cache.get<Session | null>(
			`session-userAgent-${userAgent}`
		)
		if (!session) {
			const session: Session | null = await this.prisma.session.findUnique({
				where: { userAgent }
			})
			if (!session) return null
			await this.setCache(session)
			return session
		}
		return session
	}

	public async delete(id: string): Promise<Session> {
		const session = await this.prisma.session
			.delete({ where: { id } })
			.catch((err: string) => {
				this.logger.error(red(err))
				throw new InternalServerErrorException('Unable to delete a session')
			})

		await this.cleanCache(session)
		return session
	}

	// Helpers
	private async setCache(session: Session): Promise<void> {
		await this.cache.set(`session-id-${session.id}`, session, SessionTTL)
		await this.cache.set(
			`session-userAgent-${session.userAgent}`,
			session,
			SessionTTL
		)
	}

	private async cleanCache(session: Session): Promise<void> {
		await this.cache.del(`session-id-${session.id}`)
		await this.cache.del(`session-userAgent-${session.userAgent}`)
	}
}
