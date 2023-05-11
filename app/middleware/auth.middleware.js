import AsyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'

import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user.util.js'

export const protect = AsyncHandler(async (req, res, next) => {
	let token, token1
	token = req.headers.authorization
	token1 = req.body.authorization //пока не знаю, как лучше передавать токен авторизации, через тело или в заголовках, по идее это GET, но использую тело (Необычно)

	const decoded = jwt.verify(token, process.env.JWT_SECRET)

	const userFound = await prisma.user.findUnique({
		where: {
			id: decoded.userId
		},
		select: UserFields
	})

	if (userFound) {
		req.user = userFound //записываем данные юзера именно в реквест юзер, чтобы потом можно было в любом месте получить данные пользователя
		next()
	} else {
		res.status(400)
		throw new Error('Not authorized! Token failed')
	}

	if (!token) {
		res.status(401)
		throw new Error('NO Token')
	}
})
