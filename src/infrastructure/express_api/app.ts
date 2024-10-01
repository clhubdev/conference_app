import express from "express"
import conferenceRoutes from './routes/conference.routes'
import { errorHandlerMiddleware } from "./middlewares/error-handler.middleware"
import { jsonReponseMiddleware } from "./middlewares/json-response.middleware"

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use(jsonReponseMiddleware)
app.use(conferenceRoutes)
app.use(errorHandlerMiddleware)

export default app