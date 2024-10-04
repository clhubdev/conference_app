import { Executable } from "../../core/executable.interface"
import { IIDGenerator } from "../../core/ports/id-generator.interface"
import { IMailer } from "../../core/ports/mailer.interface"
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository"
import { User } from "../../user/entities/user.entity"
import { InMemoryBookingRepository } from "../adapters/in-memory-booking-repository"
import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { Booking } from "../entities/booking.entity"
import { Conference } from "../entities/conference.entity"

type MakeBookingRequest = {
    user: User,
    conference: Conference
}

type MakeBookingResponse = {
    id: string
}

export class MakeBooking implements Executable<MakeBookingRequest, MakeBookingResponse> {
    constructor(
        private readonly idGenerator: IIDGenerator,
        private readonly repository: InMemoryBookingRepository,
        private readonly userRepository: InMemoryUserRepository,
        private readonly conferenceRepository: InMemoryConferenceRepository,
        private readonly mailer: IMailer,
    ) { }

    async execute({ user, conference }): Promise<MakeBookingResponse> {
        const id = this.idGenerator.generate()

        const newBooking = new Booking({
            id,
            userId: user.props.id,
            conferenceId: conference.props.id,
        })

        //Vérifier si l'utilisateur est déjà enregistré
        if(await this.isAlreadyRegisted(conference, user)) throw new Error('The user is already registered for this conference')

        //Vérifier si la conférence est sold out
        if(await this.isSoldOut(conference)) throw new Error('This conference is sold out')

        await this.repository.create(newBooking)
        await this.sendEmailToParticipantAndOrganize(newBooking)

        return { id }
    }

    async sendEmailToParticipantAndOrganize(booking: Booking): Promise<void> {
        //Chercher le participant
        const participant = await this.userRepository.findById(booking.props.userId)
        if (!participant) throw new Error('No participant found')

        //Chercher l'organisateur
        const conference = await this.conferenceRepository.findById(booking.props.conferenceId)
        if (!conference) throw new Error('No conference found')
        const organizer = await this.userRepository.findById(conference.props.organizerId)
        if (!organizer) throw new Error('No organizer found')

        this.mailer.send({
            from: 'TEDx Conference',
            to: participant.props.emailAddress,
            subject: `Register confirmation`,
            body: `We would like to confirm your participation in the conference: ${conference.props.title}`
        })

        this.mailer.send({
            from: 'TEDx Conference',
            to: organizer.props.emailAddress,
            subject: `A new participant for your conference`,
            body: `${participant.props.emailAddress} has registered for your conference`
        })
    }

    async isAlreadyRegisted(conference: Conference, user: User): Promise<boolean> {

        const bookings = await this.repository.findByConferenceAndParticipant(conference.props.id, user.props.id)

        if(bookings.length > 0) {
            return true
        } else {
            return false
        }
    }

    async isSoldOut(conference: Conference): Promise<boolean> {
        // Récupérer le nombre de place d'une conférence
        const numberOfSeat = conference.props.seats
        // Récupérer le nombre de booking d'une conférence
        const bookings = await this.repository.findByConferenceId(conference.props.id)

        if(numberOfSeat - bookings.length === 0) {
            return true
        } else {
            return false
        }

    }


}