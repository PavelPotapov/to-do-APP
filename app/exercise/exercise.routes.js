import express from 'express'

import { protect } from '../middleware/auth.middleware.js'

import {
	createNewExercise,
	deleteExercises,
	getExercises,
	updateExercises
} from './exercise.controller.js'

const router = express.Router()

router.route('/').post(protect, createNewExercise)
router.route('/').get(protect, getExercises)
router.route('/delete').delete(protect, deleteExercises)
router.route('/:id').put(protect, updateExercises)

export default router
