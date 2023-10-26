import { ExecutionContext, createParamDecorator } from '@nestjs/common'
import { Request } from 'express'

export const UserAgent = createParamDecorator((_, ctx: ExecutionContext): string => {
	const req: Request = ctx.switchToHttp().getRequest()

	return req.headers['user-agent']
})
