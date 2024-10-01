import express, { NextFunction } from 'express'
import { organizeConference } from '../controllers/conference.controller'

const router = express.Router()

router.post('/conference', organizeConference)

export default router