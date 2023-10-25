import { LoginInput } from './types'

export class LoginCommand {
	constructor(public readonly input: LoginInput) {}
}
