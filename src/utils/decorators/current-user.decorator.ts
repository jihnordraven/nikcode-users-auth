import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { User } from '@prisma/client'
import { Request } from 'express'

export const CurrentUser = createParamDecorator(
	(key: keyof User, ctx: ExecutionContext): User | keyof User => {
		const req: Request & { user: unknown } = ctx.switchToHttp().getRequest()

		return key ? req.user[key] : req.user
	}
)
