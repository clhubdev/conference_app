import { differenceInDays, differenceInHours } from "date-fns"
import { Entity } from "../../core/entities/entity"

type ConferenceProps = {
    id: string,
    organizerId: string,
    title: string,
    startDate: Date,
    endDate: Date, 
    seats: number,  
}

export class Conference extends Entity<ConferenceProps> {
    
    isTooClose(now: Date): boolean {
        return differenceInDays(this.props.startDate, now) < 3
    }
    
    isTooLong(): boolean {
        return differenceInHours(this.props.endDate, this.props.startDate) > 3
    }

    hasTooManySeats(): boolean {
        return this.props.seats > 1000
    }

    hasNotEnoughSeats(minimalSeats: number = 20): boolean {
        minimalSeats = minimalSeats <= 20 ? 20 : minimalSeats
        return this.props.seats < minimalSeats
    }
}