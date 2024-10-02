import { IDateGenerator } from "../../conference/ports/date-generator.interface";

export class CurrentDateGenerator implements IDateGenerator {
    now(): Date {
        return new Date()
    }
}