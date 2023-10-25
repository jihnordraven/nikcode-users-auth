import { WinstonModule } from 'nest-winston'
import { transports, format } from 'winston'

export const winstonLogger = {
	logger: WinstonModule.createLogger({
		transports: [
			new transports.File({
				filename: `logs/errors.log`,
				level: 'error',
				format: format.combine(format.timestamp(), format.json())
			}),
			new transports.File({
				filename: `logs/logs.log`,
				format: format.combine(format.timestamp(), format.json())
			}),
			new transports.Console({
				format: format.combine(
					format.cli(),
					format.splat(),
					format.timestamp(),
					format.printf(info => {
						return `${info.timestamp} ${info.level}: ${info.message}`
					})
				)
			})
		]
	})
}
