import express from 'express'
import { organizeConference, changeSeats, changeDates, bookConference } from '../controllers/conference.controller'
import { isAuthenticated } from '../middlewares/authentification.middleware'
import container from '../../config/dependency-injection'

const router = express.Router()

router.use(isAuthenticated)
router.post('/conference', organizeConference(container))
router.post('/conference/booking', bookConference(container))
router.patch('/conference/seats/:id', changeSeats(container))
router.patch('/conference/dates/:id', changeDates(container))

export default router