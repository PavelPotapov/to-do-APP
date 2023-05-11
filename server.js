import 'colors'
import dotenv from 'dotenv'
import express from 'express'
import jswb from 'jsonwebtoken'
import morgan from 'morgan'

import authRoutes from './app/auth/auth.routes.js'
import { protect } from './app/middleware/auth.middleware.js'
import { errorHandler, notFound } from './app/middleware/error.middleware.js'
import { prisma } from './app/prisma.js'
import userRoutes from './app/user/user.routes.js'

dotenv.config()

const app = express()

async function main() {
	if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))

	const token = jswb.sign('1', process.env.JWT_SECRET)
	console.log(token.toString().red.bold)

	app.use(express.json())
	app.use('/api/auth', authRoutes)
	app.use('/api/users', userRoutes)

	app.use(notFound)
	app.use(errorHandler)

	const PORT = process.env.PORT || 5000

	app.listen(
		PORT,
		console.log(
			`🤖 Server running in ${process.env.NODE_ENV} mod on port ${PORT}`.blue
				.bold
		)
	)
}

main()
	.then(async () => {
		await prisma.$disconnect()
	})
	.catch(async e => {
		console.log(e)
		await prisma.$disconnect()
		process.exit(1)
	})
