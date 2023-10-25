import { BadRequestException } from '@nestjs/common'

export const ValidatePipeOptions = {
	transform: true,
	stopAtFirstError: true,
	exceptionFactory: (errors: any) => {
		const errorsForResponse = []
		errors.forEach((e: any) => {
			const constraintsKey = Object.keys(e.constraints)
			constraintsKey.forEach(key => {
				errorsForResponse.push({
					message: e.constraints[key],
					field: e.property
				})
			})
		})
		throw new BadRequestException(errorsForResponse)
	}
}
