type ValidationPattern = () => RegExp

export const EmailPattern: ValidationPattern = (): RegExp =>
	/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const LoginPattern: ValidationPattern = (): RegExp => /^[a-zA-Z0-9_-]+$/

export const PasswPattern: ValidationPattern = (): RegExp =>
	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d!@#$%^&*()-_+=]{8,}$/
