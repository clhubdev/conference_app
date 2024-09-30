import { Conference } from "../entities/conference.entity"

export class InMemoryConferenceRepository {
    database: Conference[] = []

    async create(conference: Conference): Promise<void> {
        this.database.push(conference)
    }
} 