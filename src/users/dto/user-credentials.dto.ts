import { IsNotEmpty, Matches, MaxLength, MinLength } from '@nestjs/class-validator';

export class UserCredentialsDto {
  @IsNotEmpty()
  email: string;

  @MinLength(8)
  @MaxLength(32)
  @Matches(/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]$/, {
    message: 'Password is too weak',
  })
  password: string;
}
