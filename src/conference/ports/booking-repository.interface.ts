import { Booking } from "../entities/booking.entity";

export interface IBookingRepository {
    database: Booking[]

    create(booking: Booking): Promise<void>
    findById(id: string): Promise<Booking[]>
    findByConferenceAndParticipant(conferenceId: string, userId: string): Promise<Booking[]>
    findByConferenceId(conferenceId: string): Promise<Booking[]> 
}