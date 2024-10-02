import { Request, Response, NextFunction } from "express";
import { CreateConferenceInputs } from "../dto/conference.dto";
import { ValidationRequest } from "../utils/validate-request";
import { AwilixContainer } from "awilix";


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
