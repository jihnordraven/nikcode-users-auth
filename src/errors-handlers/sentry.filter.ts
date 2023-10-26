import { Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { BaseExceptionFilter } from '@nestjs/core'
import { captureException } from '@sentry/node'

@Catch()
export class SentryFilter extends BaseExceptionFilter {
	catch(exception: HttpException & { status: number }, host: ArgumentsHost) {
		const capturedStatuses: number[] = [500, 501, 502, 503, 504]

		// @ts-ignore
		if (capturedStatuses.includes(exception.status)) {
			captureException(exception)
		}

		super.catch(exception, host)
	}
}
