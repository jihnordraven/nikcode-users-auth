export const JWT_CONFIG = {
	// jwt access
	JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
	JWT_ACCESS_EXPIRES: process.env.JWT_REFRESH_EXPIRES,

	// jwt refresh
	JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
	JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES
}