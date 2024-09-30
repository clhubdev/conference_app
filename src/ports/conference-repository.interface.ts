import { Conference } from "../entities/conference.entity"

export interface IMemoryConferenceRepository {
    create(conference: Conference) : Promise<void>
}