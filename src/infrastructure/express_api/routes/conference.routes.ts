import express, { NextFunction } from 'express'
import { organizeConference } from '../controllers/conference.controller'
import { isAuthenticated } from '../middlewares/authentification.middleware'

const router = express.Router()

router.use(isAuthenticated)
router.post('/conference', organizeConference)

export default router