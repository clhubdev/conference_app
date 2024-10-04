import { testUsers } from "../../user/tests/user-seeds";
import { Booking } from "../entities/booking.entity";
import { testConference } from "./conference-seeds";

export const testBooking = {
    bobBooking: new Booking({
        id: "id-1",
        userId: testUsers.bob.props.id,
        conferenceId: testConference.conference1.props.id,
    }),

    aliceBooking: new Booking({
        id: "id-2",
        userId: testUsers.alice.props.id,
        conferenceId: testConference.conference1.props.id,
    })
}