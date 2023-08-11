import { Body, Controller, Post } from '@nestjs/common';
import { UserCredentialsDto } from 'src/users/dto/user-credentials.dto';
import { AuthService } from './auth.service';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/web/signin')
  async webSignIn(@Body() userCredentialDto: UserCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.webSignIn(userCredentialDto);
  }

  @Post('/app/signin')
  async appSignIn(@Body() userCredentialDto: UserCredentialsDto): Promise<{ accessToken: string }> {
    return await this.authService.appSignIn(userCredentialDto);
  }
}
