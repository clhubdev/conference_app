import { IDateGenerator } from "../../conference/ports/date-generator.interface";

export class fixedDateGenerator implements IDateGenerator {
    now(): Date {
        return new Date('2024-01-01T00:00:00Z')
    }
}