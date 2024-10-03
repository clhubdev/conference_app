import express from 'express'
import { errorHandlerMiddleware } from '../../infrastructure/express_api/middlewares/error-handler.middleware'
import { jsonReponseMiddleware } from '../../infrastructure/express_api/middlewares/json-response.middleware'
import conferenceRoutes from '../../infrastructure/express_api/routes/conference.routes'
import { IFixture } from '../fixtures/fixture.interface'
import { AwilixContainer } from 'awilix'
import container from '../../infrastructure/config/dependency-injection'
import mongoose from 'mongoose'

export class TestApp {
    private app: express.Application
    private container: AwilixContainer

    constructor() {
        this.app = express()
        this.container = container
    }

    async setup() {
        await mongoose.connect('mongodb://admin:qwerty@localhost:3702/conferences?authSource=admin')
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(jsonReponseMiddleware)
        this.app.use(conferenceRoutes)
        this.app.use(errorHandlerMiddleware)
    }

    async loadAllFixtures(fixtures: IFixture[]) {
        return Promise.all(fixtures.map(fixture => fixture.load(this.container)))
    }

    async tearDown() {
        await mongoose.connection.close()
    }

    get expressApp() {
        return this.app
    }
}