import { IsDate, IsDateString, IsNotEmpty, isNumber, IsNumber, IsString } from "class-validator"

export class CreateConferenceInputs {
    @IsString()
    @IsNotEmpty()
    title: string
    
    @IsNumber()
    @IsNotEmpty()
    seats: number

    @IsDateString()
    @IsNotEmpty()
    startDate: Date

    @IsDateString()
    @IsNotEmpty()
    endDate: Date
}

export class ChangeSeatsInputs {
    @IsNumber()
    @IsNotEmpty()
    seats: number
}