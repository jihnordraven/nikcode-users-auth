import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

export const SwaggerConfig = (app: NestExpressApplication): void => {
	const options = new DocumentBuilder()
		.setTitle('Auth RESTFull API')
		.setDescription('APIs for users-authentiacation')
		.setVersion('1.0')
		.build()

	const document = SwaggerModule.createDocument(app, options)
	SwaggerModule.setup('api/v1/swagger', app, document, {
		customCssUrl:
			'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui.min.css',
		customJs: [
			'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.js',
			'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.js'
		]
	})
}
