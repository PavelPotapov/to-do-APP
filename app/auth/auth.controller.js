//@desc Auth user
//@route POST /api/auth/login
//@access Public
import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'


export const authUser = asyncHandler(async (req, res) => {
    const user = await prisma.user.findMany({
        where: {
            password1: '123'
        }
    })
    res.json({message:user});
})