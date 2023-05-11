import asyncHandler from 'express-async-handler'

import { prisma } from '../prisma.js'

//@desc Create a new workout
//@route POST /api/workouts
//@access Private
export const createNewWorkout = asyncHandler(async (req, res) => {
	const { name, exerciseIds } = req.body
	const workout = await prisma.workout.create({
		data: {
			name,
			exercises: {
				connect: exerciseIds.map(id => ({ id: +id }))
			}
		}
	})

	res.json(workout)
})

//@desc Get workouts
//@route GET /api/workouts/:id
//@access Private
export const getWorkout = asyncHandler(async (req, res) => {
	const workout = await prisma.workout.findUnique({
		where: { id: +req.params.id },
		include: {
			exercises: true
		}
	})
	const minutes = Math.ceil(workout.exercises.length * 3.7)
	res.json({ ...workout, minutes: minutes })
})

//@desc Get workouts
//@route GET /api/workouts
//@access Private
export const getWorkouts = asyncHandler(async (req, res) => {
	const workouts = await prisma.workout.findMany({
		orderBy: {
			createdAt: 'desc'
		},
		include: {
			exercises: true
		}
	})

	res.json({ workouts })
})

//@desc Update workouts
//@route PUT /api/workouts/:id
//@access Private
export const updateWorkout = asyncHandler(async (req, res) => {
	try {
		const { name, exerciseIds } = req.body

		const workout = await prisma.workout.update({
			where: {
				id: +req.params.id
			},
			data: {
				name,
				exercises: {
					connect: exerciseIds.map(id => ({ id: +id }))
				}
			}
		})
		res.json(workout)
	} catch (err) {
		res.status(404)
		throw new Error('Workout не найдено')
	}
})

//МОЖНО БЫЛО БЫ СДЕЛАТЬ ТАКЖЕ, КАК И С UPDATE, НО Я ЗАХОТЕЛ ПОПРОБОВАТЬ ЧТО-ТО ДРУГОЕ
//@desc Delete workouts
//@route DELETE /api/workouts/delete?workoutsId=1
//@access Private
export const deleteWorkout = asyncHandler(async (req, res) => {
	try {
		const workoutsId = req.query.workoutsId
		const workouts = await prisma.workout.delete({
			where: {
				id: Number(workoutsId)
			}
		})
		res.json('DELETED')
	} catch {
		res.status(404)
		throw new Error('Упражнение не найдено')
	}
})
