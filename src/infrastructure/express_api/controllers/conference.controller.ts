import { Request, Response, NextFunction } from "express";
import { ChangeSeatsInputs, CreateConferenceInputs } from "../dto/conference.dto";
import { ValidationRequest } from "../utils/validate-request";
import { AwilixContainer } from "awilix";
import { ChangeSeats } from "../../../conference/usecases/change-seats";


export const organizeConference = (container: AwilixContainer) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const body = req.body

            const { errors, input } = await ValidationRequest(CreateConferenceInputs, body)

            if (errors) {
                return res.jsonError(errors, 400)
            }

            const result = await container.resolve("organizeConferenceUseCase").execute({
                user: req.user,
                title: input.title,
                startDate: new Date(input.startDate),
                endDate: new Date(input.endDate),
                seats: input.seats,
            })

            return res.jsonSuccess({ id: result.id }, 201)
        } catch (error) {
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
