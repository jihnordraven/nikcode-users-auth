import { HttpException, HttpStatus } from '@nestjs/common'

type ErrorExceptionInputType = {
	message: string
	field: string
	error: string
	statusCode: HttpStatus
}

export const HandleException: (data: ErrorExceptionInputType) => void = (
	data: ErrorExceptionInputType
): Promise<void> => {
	throw new HttpException(
		{
			message: data.message,
			field: data.field,
			error: data.error,
			statusCode: data.statusCode
		},
		data.statusCode
	)
}
