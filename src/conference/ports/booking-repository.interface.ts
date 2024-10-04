import { Booking } from "../entities/booking.entity";

export interface IBookingRepository {
    create(booking: Booking): Promise<void>
    findById(id: string): Promise<Booking[]>
}