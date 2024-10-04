import { FixedIDGenerator } from "../../core/adapters/fixed-id-generator"
import { InMemoryMailer } from "../../core/adapters/in-memory-mailer"
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository"
import { User } from "../../user/entities/user.entity"
import { testUsers } from "../../user/tests/user-seeds"
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { Booking } from "../entities/booking.entity"
import { Conference } from "../entities/conference.entity"
import { testBooking } from "../tests/booking-seeds"
import { testConference } from "../tests/conference-seeds"
import { MakeBooking } from "./make-booking"

// (Vérifier le places restantes, vérifier qu'on ne participe pas déjà, envoyer un email de confirmation, envoyer un email à l'organisateur)
describe('Feature: Book a conference place', () => {
    function expectBookingToEqual(booking: Booking){
        expect(booking.props).toEqual({
            id: "id-1",
            userId: 'john-doe',
            conferenceId: 'id-1'
        })
    }

    let idGenerator: FixedIDGenerator
    let repository: InMemoryBookingRepository
    let useCase: MakeBooking
    let userRepository: InMemoryUserRepository
    let conferenceRepository: InMemoryConferenceRepository
    let mailer: InMemoryMailer

    beforeEach(async () => {
        idGenerator = new FixedIDGenerator
        repository = new InMemoryBookingRepository()
        userRepository = new InMemoryUserRepository()
        conferenceRepository = new InMemoryConferenceRepository()
        mailer = new InMemoryMailer()
        useCase = new MakeBooking(idGenerator, repository, userRepository, conferenceRepository, mailer)

        await userRepository.create(testUsers.johnDoe)
        await conferenceRepository.create(testConference.conference1)
    })

    describe('Scenario: Happy path', () => {
        const payload = {
            user: testUsers.johnDoe,
            conference: testConference.conference1,
        }
        it('should return the ID', async() => {
            const result = await useCase.execute(payload)

            expect(result.id).toEqual('id-1')
        })

        it('should insert the booking into the database', async () => {
            await useCase.execute(payload)

            const createdBooking = repository.database[0]

            expect(repository.database.length).toBe(1)
            expectBookingToEqual(createdBooking)
        })

        it('should send an email to the new participant and organizer', async () => {
            await useCase.execute(payload)

            // Listing des participants
            expect(mailer.sentEmails).toEqual([
                {
                    from: 'TEDx Conference',
                    to: testUsers.johnDoe.props.emailAddress,
                    subject: `Register confirmation`,
                    body: `We would like to confirm your participation in the conference: ${testConference.conference1.props.title}`
                }, 
                {
                    from: 'TEDx Conference',
                    to: testUsers.johnDoe.props.emailAddress,
                    subject: `A new participant for your conference`,
                    body: `${testUsers.johnDoe.props.emailAddress} has registered for your conference`
                }
            ])
        })
    })

    describe('Scenario: The user has already reserved a place at this conference ', () => {
        const payload = {
            user: testUsers.alice,
            conference: testConference.conference1,
        }

        it('should throw an error', async () => {
            await repository.create(testBooking.aliceBooking)
            await expect(useCase.execute(payload)).rejects.toThrow('The user is already registered for this conference')
        })
    })

     describe('Scenario: The conference is sold out ', () => {
        const payload = {
            user: testUsers.alice,
            conference: testConference.conference1,
        }

        it('should throw an error', async () => {
            
            // Créé autant de réservation qu'il y a de place dans la conférence pour la rendre complète
            for(let i = 0; i < testConference.conference1.props.seats; i++) {
                await repository.create(testBooking.bobBooking)
            }

            await expect(useCase.execute(payload)).rejects.toThrow('This conference is sold out')
        })

    })
})