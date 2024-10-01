import { CurrentDateGenerator } from "../../../src/adapters/current-date-generator";
import { InMemoryConferenceRepository } from "../../../src/adapters/in-memory-conference-repository";
import { RandomIDGenerator } from "../../../src/adapters/random-id-generator";
import { User } from "../../../src/entities/user.entity";
import { OrganizeConference } from "../../../src/usecases/organize-conference";
import { Request, Response, NextFunction } from "express";
import { CreateConferenceInputs } from "../dto/conference.dto";

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
        const { title, seats, startDate, endDate } = <CreateConferenceInputs>req.body
        const result = await usecase.execute({
            user: new User({id: 'john-doe'}),
            title,
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            seats,
        })

        return res.status(201).json(result)
    } catch (error) {
        next(error);
    }
};