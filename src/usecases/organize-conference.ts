import { IMemoryConferenceRepository } from "../ports/conference-repository.interface"
import { Conference } from "../entities/conference.entity"
import { IIDGenerator } from "../ports/id-generator.interface"
import { IDateGenerator } from "../ports/date-generator.interface"
import { differenceInDays } from "date-fns"
import { User } from "../entities/user.entity"

export class OrganizeConference {

    constructor(
        private readonly repository: IMemoryConferenceRepository,
        private readonly idGenerator: IIDGenerator, //FixedIdGenerator => id-1
        private readonly dateGenerator: IDateGenerator
    ) { }

    async execute(data: { user: User, title: string, startDate: Date, endDate: Date, seats: number }) {

        const id = this.idGenerator.generate()

        const newConference = new Conference({
            id,
            organizerId: data.user.props.id,
            title: data.title,
            startDate: data.startDate,
            endDate: data.endDate,
            seats: data.seats
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