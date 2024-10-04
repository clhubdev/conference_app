import { Entity } from "../../core/entities/entity";
import { InMemoryUserRepository } from "../../user/adapters/in-memory-user-repository";
import { User } from "../../user/entities/user.entity";
import { Conference } from "./conference.entity";

type BookingProps = {
    id: string,
    userId: string,
    conferenceId: string
}

export class Booking extends Entity<BookingProps> {

}