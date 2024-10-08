import { BookingFixture } from "../fixtures/booking-fixture";
import { e2eConference } from "./conference-seeds";
import { Booking } from "../../conference/entities/booking.entity";
import { e2eUsers } from "./user-seeds";

export const e2eBooking = {
    bobBooking: new BookingFixture(
        new Booking({
            id: 'id-1',
            userId: e2eUsers.bob.entity.props.id,
            conferenceId: e2eConference.conference1.entity.props.id,
        })
    ),
    aliceBooking: new BookingFixture(
        new Booking({
            id: 'id-2',
            userId: e2eUsers.alice.entity.props.id,
            conferenceId: e2eConference.conference1.entity.props.id,
        })
    ),
}