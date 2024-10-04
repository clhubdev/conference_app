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

export class CreateBookingInputs {
    @IsString()
    @IsNotEmpty()
    userId: string

    @IsString()
    @IsNotEmpty()
    conferenceId: string
}

export class ChangeSeatsInputs {
    @IsNumber()
    @IsNotEmpty()
    seats: number
}

export class ChangeDatesInputs {
    @IsDateString()
    @IsNotEmpty()
    startDate: Date

    @IsDateString()
    @IsNotEmpty()
    endDate: Date
}