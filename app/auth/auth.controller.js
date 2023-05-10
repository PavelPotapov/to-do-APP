//@desc Auth user
//@route POST /api/auth/login
//@access Public

import { prisma } from "../prisma.js";

export const authUser = async (req, res) => {
    const user = await prisma.user.findMany()
    res.json({message:user});
}  