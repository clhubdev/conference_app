import { differenceInDays, differenceInHours } from "date-fns"

type ConferenceProps = {
    id: string,
    organizerId: string,
    title: string,
    startDate: Date,
    endDate: Date, 
    seats: number,  
}

export class Conference {
    constructor(public props: ConferenceProps) {}

    isTooClose(now: Date): boolean {
        return differenceInDays(this.props.startDate, now) < 3
    }
    
    isTooLong(): boolean {
        return differenceInHours(this.props.endDate, this.props.startDate) > 3
    }

    hasTooManySeats(): boolean {
        return this.props.seats > 1000
    }

    hasNotEnoughSeats(): boolean {
        return this.props.seats < 20
    }

    update(data: Partial<ConferenceProps>) {
        this.props = {... this.props, ... data}
    }
}