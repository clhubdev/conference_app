import { Request, Response, NextFunction } from "express";
import { ChangeDatesInputs, ChangeSeatsInputs, CreateBookingInputs, CreateConferenceInputs } from "../dto/conference.dto";
import { ValidationRequest } from "../utils/validate-request";
import { AwilixContainer } from "awilix";
import { ChangeSeats } from "../../../conference/usecases/change-seats";
import { ChangeDates } from "../../../conference/usecases/change-dates";
import { User } from "../../../user/entities/user.entity";
import { OrganizeConference } from "../../../conference/usecases/organize-conference";
import { MakeBooking } from "../../../conference/usecases/make-booking";


export const organizeConference = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body

            const { errors, input } = await ValidationRequest(CreateConferenceInputs, body)

            if (errors) {
                return res.jsonError(errors, 400)
            }

            const result = await (container.resolve("organizeConferenceUseCase") as OrganizeConference).execute({
                user: req.user,
                title: input.title,
                startDate: new Date(input.startDate),
                endDate: new Date (input.endDate),
                seats: input.seats,
            })

            return res.jsonSuccess({ id: result.id }, 201)
        } catch (error) {
            next(error);
        }
    }
}

export const bookConference = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body

            const { errors, input } = await ValidationRequest(CreateBookingInputs, body)

            if (errors) {
                console.log(errors)
                return res.jsonError(errors, 400)
            }

            const result = await (container.resolve("makeBookingUseCase") as MakeBooking).execute({
                userId: input.userId,
                conferenceId: input.conferenceId
            })

            return res.jsonSuccess({ id: result.id }, 201)
        } catch (error) {
            console.log(error)
            next(error);
        }
    }
}


export const changeSeats = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const body = req.body

            const { errors, input } = await ValidationRequest(ChangeSeatsInputs, body)

            if (errors) {
                return res.jsonError(errors, 400)
            }

            await (container.resolve('changeSeats') as ChangeSeats).execute({
                user: req.user,
                conferenceId: id,
                seats: input.seats
            })

            return res.jsonSuccess({message: "The number of seats was changed correctly"}, 200);
        } catch (error) {
            next(error);
        }
    };
};

export const changeDates = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { id } = req.params
            const { errors, input } = await ValidationRequest(ChangeDatesInputs, req.body)

            if (errors) {
                return res.jsonError(errors, 400)
            }

            await (container.resolve('changeDates') as ChangeDates).execute({
                user: req.user, 
                conferenceId: id, 
                startDate: new Date(input.startDate), 
                endDate: new Date(input.endDate),
            })

            return res.jsonSuccess({message: "Dates was changed correctly"}, 200);
        } catch (error) {
            next(error);
        }
    };
};
