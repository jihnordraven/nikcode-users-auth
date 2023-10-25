import { LogoutInput } from './types'

export class LogoutCommand {
	constructor(public readonly input: LogoutInput) {}
}
