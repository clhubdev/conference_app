import { InMemoryConferenceRepository } from "../adapters/in-memory-conference-repository"
import { IIDGenerator } from "../../core/ports/id-generator.interface"
import { User } from "../../user/entities/user.entity"
import { IDateGenerator } from "../../core/ports/date-generator.interface"
import { Conference } from "../entities/conference.entity"
import { Executable } from "../../core/executable.interface"

type OrganizeRequest = {
    user: User,
    title: string,
    startDate: Date,
    endDate: Date,
    seats: number
}

type OrganizeResponse = {
    id: string
}

export class OrganizeConference implements Executable<OrganizeRequest, OrganizeResponse> {

    constructor(
        private readonly repository: InMemoryConferenceRepository,
        private readonly idGenerator: IIDGenerator, //FixedIdGenerator => id-1
        private readonly dateGenerator: IDateGenerator
    ) { }

    async execute({ user, title, startDate, endDate, seats }) {

        const id = this.idGenerator.generate()

        const newConference = new Conference({
            id,
            organizerId: user.props.id,
            title,
            startDate,
            endDate,
            seats
        })

        if(newConference.isTooClose(this.dateGenerator.now())) {
            throw new Error('The conference must happen in at least 3 days')
        }

        if(newConference.isTooLong()) {
            throw new Error('The conference is too long (> 3 hours)')
        }

        if(newConference.hasTooManySeats()) {
            throw new Error('The conference must have a maximum of 1000 seats')
        }

        if(newConference.hasNotEnoughSeats()) {
            throw new Error('The conference must have at leat 20 seats')
        }

        await this.repository.create(newConference)

        return { id }
    }
}