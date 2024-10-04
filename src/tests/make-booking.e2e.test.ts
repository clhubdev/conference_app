import request from 'supertest'
import container from '../infrastructure/config/dependency-injection'
import { TestApp } from './utils/test-app'
import { Application } from 'express'
import { e2eUsers } from './seeds/user-seeds'
import { e2eConference } from './seeds/conference-seeds'
import { IBookingRepository } from '../conference/ports/booking-repository.interface'

describe('Feature: Make a booking', () => {
    let testApp: TestApp
    let app: Application

    beforeEach(async () => {
        testApp = new TestApp()
        await testApp.setup()
        await testApp.loadAllFixtures([e2eUsers.johnDoe, e2eConference.conference1])
        app = testApp.expressApp
    })

    afterAll(async () => {
        await testApp.tearDown()
    })

    it('should register a booking', async () => {

        const result = await request(app)
            .post('/conference/booking')
            .set('Authorization', e2eUsers.johnDoe.createAuthorizationToken())
            .send({
                userId: e2eUsers.johnDoe.entity.props.id,
                conferenceId: e2eConference.conference1.entity.props.id
            })

        expect(result.status).toBe(201)
        expect(result.body.data).toEqual({ id: expect.any(String) })

        const bookingRepository = container.resolve('bookingRepository') as IBookingRepository
        const fetchedBooking = await bookingRepository.findById(result.body.data.id)

        expect(fetchedBooking).toBeDefined
        
        expect(fetchedBooking[0]?.props).toEqual({
            id: result.body.data.id,
            userId: e2eUsers.johnDoe.entity.props.id,
            conferenceId: e2eConference.conference1.entity.props.id
        })
    })
})