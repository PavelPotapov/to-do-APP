import AsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';



import { prisma } from '../prisma.js';
import { UserFields } from '../utils/user.util.js';


export const protect = AsyncHandler(async (req, res, next) => {
	let token
	token = req.headers.authorization
	token = token.split(' ')[1]

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