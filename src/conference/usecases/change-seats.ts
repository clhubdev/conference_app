import { Executable } from "../../core/executable.interface"
import { ConferenceNotFoundException } from "../../exceptions/conference-not-found"
import { ConferenceUpdateForbiddenException } from "../../exceptions/conference-update-forbidden"
import { User } from "../../user/entities/user.entity"
import { IConferenceRepository } from "../ports/conference-repository.interface"

type RequestChangeSeats = {
    user: User,
    conferenceId: string,
    seats: number
}

type ResponseChangeSeats = void

export class ChangeSeats implements Executable<RequestChangeSeats, ResponseChangeSeats>  {

    constructor(private readonly repository: IConferenceRepository){}

    async execute({user, conferenceId, seats}) {
        const conference = await this.repository.findById(conferenceId)

        if(!conference) throw new ConferenceNotFoundException()
        if(user.props.id !== conference.props.organizerId) throw new ConferenceUpdateForbiddenException()

        conference.update({seats})

        if(conference.hasNotEnoughSeats() || conference.hasTooManySeats()) throw new Error('The conference must have a maximum of 1000 seats and minimum of 20 seats')

        await this.repository.update(conference)
    }
}