import { CurrentDateGenerator } from "../../../adapters/current-date-generator";
import { InMemoryConferenceRepository } from "../../../adapters/in-memory-conference-repository";
import { RandomIDGenerator } from "../../../adapters/random-id-generator";
import { User } from "../../../entities/user.entity";
import { OrganizeConference } from "../../../usecases/organize-conference";
import { Request, Response, NextFunction } from "express";
import { CreateConferenceInputs } from "../dto/conference.dto";
import { ValidationRequest } from "../utils/validate-request";

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
            user: new User({id: 'john-doe'}),
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