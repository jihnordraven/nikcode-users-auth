import { CommandHandler, ICommandHandler } from '@nestjs/cqrs'
import { RegisterCommand } from './register.command'
import { UsersRepo } from '../../../../modules/users/repositories/users.repo'
import { User } from '@prisma/client'
import {
	ConflictException,
	HttpStatus,
	Inject,
	InternalServerErrorException
} from '@nestjs/common'
import { hash } from 'bcrypt'
import {
	MAILER_SERVICE,
	PAYMENTS_SERVICE
} from '../../../../utils/constants/services.constants'
import { ClientProxy } from '@nestjs/microservices'
import { Observable, firstValueFrom } from 'rxjs'

@CommandHandler(RegisterCommand)
export class RegisterHandler implements ICommandHandler<RegisterCommand> {
	constructor(
		@Inject(PAYMENTS_SERVICE) private readonly paymentsClient: ClientProxy,
		@Inject(MAILER_SERVICE) private readonly mailerClient: ClientProxy,
		protected readonly usersRepo: UsersRepo
	) {}

	public async execute({ input }: RegisterCommand): Promise<any> {
		const { email, login, passw } = input

		const isUserEmail: User | null = await this.usersRepo.findByEmail(email)
		if (isUserEmail)
			throw new ConflictException({
				message: 'User with this email is already registered',
				error: 'Conflict',
				status: HttpStatus.CONFLICT,
				context: 'email-conflict'
			})

		const isUserLogin: User | null = await this.usersRepo.findByLogin(login)
		if (isUserLogin)
			throw new ConflictException({
				message: 'User with this login is already registered',
				error: 'Conflict',
				status: HttpStatus.CONFLICT,
				context: 'login-conflict'
			})

		const hashPassw: string = await hash(passw, 8)
		const user: User = await this.usersRepo.create({ email, login, hashPassw })

		const res: Observable<{ ok: boolean }> = this.paymentsClient.send(
			'user-created',
			user.id
		)
		const result = await firstValueFrom(res)

		if (!result.ok) {
			await this.usersRepo.delete(user.id)
			throw new InternalServerErrorException('Unable to create a user')
		}

		this.mailerClient.emit('user-created', email)
	}
}
