import { IIDGenerator } from "../../conference/ports/id-generator.interface";

export class FixedIDGenerator implements IIDGenerator {
    generate(): string {
        return "id-1"
    }
}