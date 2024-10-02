import express from 'express'
import { organizeConference, changeSeats } from '../controllers/conference.controller'
import { isAuthenticated } from '../middlewares/authentification.middleware'
import container from '../../config/dependency-injection'

const router = express.Router()

router.use(isAuthenticated)
router.post('/conference', organizeConference(container))
router.patch('/conference/seats/:id', changeSeats(container))

export default router