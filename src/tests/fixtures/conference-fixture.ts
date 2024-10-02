import { AwilixContainer } from "awilix";
import { IFixture } from "./fixture.interface";
import { Conference } from "../../conference/entities/conference.entity";

export class ConferenceFixture implements IFixture {
    constructor(public entity: Conference) {}

    async load(container: AwilixContainer): Promise<void> {
        const repository = container.resolve('conferenceRepository')
        await repository.create(this.entity)
    }
} 