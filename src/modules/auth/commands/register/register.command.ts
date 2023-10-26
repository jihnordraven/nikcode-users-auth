import { RegisterInput } from './types'

export class RegisterCommand {
	constructor(public readonly input: RegisterInput) {}
}
