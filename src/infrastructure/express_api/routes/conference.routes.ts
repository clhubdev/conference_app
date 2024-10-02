import express from 'express'
import { organizeConference } from '../controllers/conference.controller'
import { isAuthenticated } from '../middlewares/authentification.middleware'
import container from '../../config/dependency-injection'

const router = express.Router()

router.use(isAuthenticated)
router.post('/conference', organizeConference(container))

export default router