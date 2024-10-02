import { User } from "../../../user/entities/user.entity";
import { Request, Response, NextFunction } from "express";
import { CreateConferenceInputs } from "../dto/conference.dto";
import { ValidationRequest } from "../utils/validate-request";
import { CurrentDateGenerator } from "../../../core/adapters/current-date-generator";
import { InMemoryConferenceRepository } from "../../../conference/adapters/in-memory-conference-repository";
import { RandomIDGenerator } from "../../../core/adapters/random-id-generator";
import { OrganizeConference } from "../../../conference/usecases/organize-conference";

const IdGenerator = new RandomIDGenerator()
const currentDateGenerator = new CurrentDateGenerator()
const repository = new InMemoryConferenceRepository()
const usecase = new OrganizeConference(
    repository,
    IdGenerator, 
    currentDateGenerator,
)

export const organizeConference = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const body = req.body

        const {errors, input} = await ValidationRequest(CreateConferenceInputs, body)

        if(errors) {
            return res.jsonError(errors, 400)
        } 
        
        const result = await usecase.execute({
            user: req.user,
            title: input.title,
            startDate: new Date(input.startDate),
            endDate: new Date(input.endDate),
            seats: input.seats,
        })

        return res.jsonSuccess({id: result.id}, 201)
    } catch (error) {
        next(error);
    }
};