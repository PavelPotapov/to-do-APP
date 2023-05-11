import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'
import { UserFields } from '../utils/user.util.js'

//@desc Create a new exercise
//@route GET /api/exercises
//@access Private
export const createNewExercise = asyncHandler(async (req, res) => {
	const { name, times, iconPath } = req.body
	const exercise = await prisma.exercise.create({
		data: {
			name,
			times,
			iconPath
		}
	})

	res.json(exercise)
})

//@desc Update exercises
//@route PUT /api/exercises/update/:id
//@access Private
export const updateExercises = asyncHandler(async (req, res) => {
	try {
		const { name, times, iconPath } = req.body
		const exercise = await prisma.exercise.update({
			where: {
				id: +req.params.id
			},
			data: {
				name,
				times,
				iconPath
			}
		})
		res.json(exercise)
	} catch (err) {
		res.status(404)
		throw new Error('Упражнение не найдено')
	}
})

//@desc Get exercises
//@route GET /api/exercises
//@access Private
export const getExercises = asyncHandler(async (req, res) => {
	const exercises = await prisma.exercise.findMany({
		orderBy: {
			createdAt: 'desc'
		}
	})
	res.json(exercises)
})

//МОЖНО БЫЛО БЫ СДЕЛАТЬ ТАКЖЕ, КАК И С UPDATE, НО Я ЗАХОТЕЛ ПОПРОБОВАТЬ ЧТО-ТО ДРУГОЕ
//@desc Delete exercises
//@route DELETE /api/exercises/delete?exercisesId=1
//@access Private
export const deleteExercises = asyncHandler(async (req, res) => {
	try {
		const exercisesId = req.query.exercisesId
		const exercises = await prisma.exercise.delete({
			where: {
				id: Number(exercisesId)
			}
		})
		res.json('DELETED')
	} catch {
		res.status(404)
		throw new Error('Упражнение не найдено')
	}
})
