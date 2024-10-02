import { ChangeSeats } from "./change-seats"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { testConference } from "../tests/conference-seeds"
import { testUsers } from "../../user/tests/user-seeds"

describe('Feature: Changing the number of seats', () => {
    async function expectSeatUnchanges() {
        const fetchedConference = await repository.findById(testConference.conference1.props.id)
        expect(fetchedConference?.props.seats).toEqual(50)
    }

    let repository: InMemoryConferenceRepository
    let useCase: ChangeSeats

    beforeEach(async() => {
        repository = new InMemoryConferenceRepository()
        await repository.create(testConference.conference1)
        useCase = new ChangeSeats(repository)
    })

    describe('Scenario: Happy path', () => {
        it('should change the number of seats', async () => {
            await useCase.execute({
                user: testUsers.johnDoe,
                conferenceId: testConference.conference1.props.id,
                seats: 100
            })

            const fetchedConference = await repository.findById(testConference.conference1.props.id)

            expect(fetchedConference!.props.seats).toEqual(100)
        })
    })

    describe('Scenario: Conference does exist', () => {
        it('should fail', async () => {
            await expect(useCase.execute({
                user: testUsers.johnDoe,
                conferenceId: 'non-existing-id',
                seats: 100
            })).rejects.toThrow('Conference not found')

            await expectSeatUnchanges()
        })
    })

    describe('Scenario: Update the conference of someone else', () => {
        it('should fail', async () => {
            await expect(useCase.execute({
                user: testUsers.bob,
                conferenceId: testConference.conference1.props.id,
                seats: 100
            })).rejects.toThrow('You are not allowed to update this conference')

            await expectSeatUnchanges()
        })

    })

    describe('Scenario: Number of seats <= 1000', () => {
        it('should fail', async () => {
            await expect(useCase.execute({
                user: testUsers.johnDoe,
                conferenceId: testConference.conference1.props.id,
                seats: 1001
            })).rejects.toThrow('The conference must have a maximum of 1000 seats and minimum of 20 seats')

            await expectSeatUnchanges()
        })

    })

    describe('Scenario: Number of seats >= 20', () => {
        it('should fail', async () => {
            await expect(useCase.execute({
                user: testUsers.johnDoe,
                conferenceId: testConference.conference1.props.id,
                seats: 15
            })).rejects.toThrow('The conference must have a maximum of 1000 seats and minimum of 20 seats')

            await expectSeatUnchanges()
        })

    })

})