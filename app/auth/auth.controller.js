import { faker } from '@faker-js/faker'
import { hash, verify } from 'argon2'
import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user.util.js'

import { generateToken } from './generate-token.js'

//@desc Auth user
//@route POST /api/auth/login
//@access Public
export const authUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body

	const user = await prisma.user.findUnique({
		where: {
			email: email
		}
	})

	const isValidPassword = await verify(user.password, password)
	if (user && isValidPassword) {
		const token = generateToken(user.id)
		res.json({ user, token, text: 'Авторизован' })
	} else {
		res.status(400)
		throw new Error('Email or password are not correct')
	}
})

//@desc Register user
//@route POST /api/auth/register
//@access Public
export const registerUser = asyncHandler(async (req, res) => {
	//деструктуризация объекта
	const { email, password } = req.body

	//проверяем на существование текущий email
	const isHaveUser = await prisma.user.findUnique({
		where: {
			email: email
		}
	})

	if (isHaveUser) {
		res.status(400)
		throw new Error('User already exists')
	}

	const user = await prisma.user.create({
		data: {
			email,
			password: await hash(password),
			name: faker.name.fullName()
		},
		select: UserFields
	})

	const token = generateToken(user.id)
	res.json({ user, token })
})
