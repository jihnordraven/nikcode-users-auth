import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common'
import { HelloPageTemplate } from './utils/hello-page.template'
import { ConfigService } from '@nestjs/config'

@Controller('Util endpoints')
export class AppController {
	constructor(private readonly config: ConfigService) {}

	@Get()
	@HttpCode(HttpStatus.OK)
	public hello(): string {
		return HelloPageTemplate({ HOST: this.config.getOrThrow<string>('HOST') })
	}
}
