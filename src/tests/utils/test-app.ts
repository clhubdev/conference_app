import express from 'express'
import { errorHandlerMiddleware } from '../../infrastructure/express_api/middlewares/error-handler.middleware'
import { jsonReponseMiddleware } from '../../infrastructure/express_api/middlewares/json-response.middleware'
import conferenceRoutes from '../../infrastructure/express_api/routes/conference.routes'
import { IFixture } from '../fixtures/fixture.interface'
import { AwilixContainer } from 'awilix'
import container from '../../infrastructure/config/dependency-injection'

export class TestApp {
    private app: express.Application
    private container: AwilixContainer

    constructor() {
        this.app = express()
        this.container = container
    }

    async setup() {
        this.app.use(express.json())
        this.app.use(express.urlencoded({ extended: true }))
        this.app.use(jsonReponseMiddleware)
        this.app.use(conferenceRoutes)
        this.app.use(errorHandlerMiddleware)
    }

    async loadAllFixtures(fixtures: IFixture[]) {
        return Promise.all(fixtures.map(fixture => fixture.load(this.container)))
    }

    get expressApp() {
        return this.app
    }
}