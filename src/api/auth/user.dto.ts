import { IsString, IsStrongPassword } from "class-validator";

export class UserDTO {
  @IsString()
  username: string;

  @IsStrongPassword({ minLength: 8 })
  password: string;

  @IsString()
  avatar: string;
}
