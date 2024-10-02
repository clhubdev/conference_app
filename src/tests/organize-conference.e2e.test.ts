import { addDays, addHours } from 'date-fns'
import app from '../infrastructure/express_api/app'
import request from 'supertest'
import { InMemoryUserRepository } from '../user/adapters/in-memory-user-repository'
import { User } from '../user/entities/user.entity'
import { BasicAuthenticator } from '../user/services/authenticator'
describe('Feature: OrganizeConference', () => {
    const johndoe = new User({
        id: "john-doe",
        emailAddress: "johndoe@gmail.com",
        password: "qwerty"
    })

    let repository: InMemoryUserRepository

    beforeEach(async() => {
        repository = new InMemoryUserRepository()
        await repository.create(johndoe)
    })

    it('should organize a conference', async () => {
        const token = Buffer.from(`${johndoe.props.emailAddress}:${johndoe.props.password}`).toString('base64')

        jest.spyOn(BasicAuthenticator.prototype, "authenticate").mockResolvedValue(johndoe)

        const result = await request(app)
        .post('/conference')
        .set('Authorization', `Basic ${token}`)
        .send({
            title: 'My first conference',
            seats: 100,
            startDate: addDays(new Date(), 4).toISOString(),
            endDate: addDays(addHours(new Date(), 2), 4).toISOString(),
        })

        expect(result.status).toBe(201)
        expect(result.body.data).toEqual({id: expect.any(String)})
    })
})