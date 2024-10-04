import { Application } from "express"
import { TestApp } from "./utils/test-app"
import { e2eUsers } from './seeds/user-seeds'
import { e2eBooking } from "./seeds/booking-seeds"
import request from 'supertest'
import { addDays, addHours } from "date-fns"
import { e2eConference } from "./seeds/conference-seeds"
import container from "../infrastructure/config/dependency-injection"
import { IConferenceRepository } from "../conference/ports/conference-repository.interface"


describe('Feature: Change the date of conference', () => {
    let testApp: TestApp
    let app: Application

    beforeEach(async () => {
        testApp = new TestApp()
        await testApp.setup()
        await testApp.loadAllFixtures([
            e2eUsers.johnDoe, 
            e2eUsers.bob,
            e2eUsers.alice,
            e2eBooking.aliceBooking,
            e2eBooking.bobBooking,
            e2eConference.conference1,
        ])
        app = testApp.expressApp
    })

    afterAll(async () => {
        await testApp.tearDown()
    })


    describe('Scenario: Happy path', () => {
        it('should change the date', async () => {

            const startDate = addDays(new Date(), 8)
            const endDate = addDays(addHours(new Date(), 2), 8)
            const id = e2eConference.conference1.entity.props.id

            const result = await request(app)
                .patch(`/conference/dates/${id}`)
                .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
                .send({
                    startDate: startDate.toISOString(), 
                    endDate: endDate.toISOString(),
                })
            
            expect(result.status).toBe(200)

            const conferenceRepository = container.resolve('conferenceRepository') as IConferenceRepository
            const fetchedConference = await conferenceRepository.findById(id)
    
            expect(fetchedConference).toBeDefined
            expect(fetchedConference?.props.startDate).toEqual(startDate)
            expect(fetchedConference?.props.endDate).toEqual(endDate)
        })
    })

    describe('Scenario: User is not authorized', () => {
        it('should return 403 Unauthorized', async () => {
            const startDate = addDays(new Date(), 8)
            const endDate =  addDays(addHours(new Date(), 2), 8)
            const id = 'id-1'

            const result = await request(app)
                .patch(`/conference/seats/${id}`)
                .send({
                    startDate: startDate.toISOString(), 
                    endDate: endDate.toISOString(),
                })
            
            expect(result.status).toBe(403)
        })
    })
})