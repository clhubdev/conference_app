import { validate, ValidationError } from "class-validator";
import { ClassConstructor, plainToClass } from "class-transformer";

// type any car on ne sait pas quel type d'erreur on va recevoir
const validationError = async(input: any): Promise<ValidationError[] | false > => {

    const errors = await validate(input, {validationError: {target: true}}) 

    if(errors.length) return errors 

    return false
} 

// TODO : à voir plaintoclass
export const ValidationRequest = async <T>(type: ClassConstructor<T>, body: any) : Promise<{errors: boolean|string, input: T}> => {
    const input = plainToClass(type, body)
    const errors = await validationError(input)

    if(errors) {
        // Object as any car typescript n'arrive pas à voir ce que seront le type des contstraints. 
        const errorMessage = errors.map(error => (Object as any).values(error.constraints)).join(', ')
        return {errors: errorMessage, input}
    }

    return {errors: false, input}
}