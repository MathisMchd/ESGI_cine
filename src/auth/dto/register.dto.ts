import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class RegisterDto {
    
    @ApiProperty({ example: 'user@example.com', description: "L'adresse email de l'utilisateur" })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

