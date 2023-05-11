import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user.util.js'

//@desc Get user profile
//@route GET /api/auth/profile
//@access Private
export const getUserProfile = asyncHandler(async (req, res) => {
	console.log('!!!!!!!!!')
	const user = await prisma.user.findUnique({
		where: {
			id: 2
		},
		select: UserFields
	})
	res.json({ user, message: 'АВТОРИЗОВАН!' })
})
