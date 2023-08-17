import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UserCredentialsDto } from 'src/users/dto/user-credentials.dto';
import { AuthService } from './auth.service';
import { RefreshJwtGuard } from './refresh-jwt-auth.guard';

@Controller()
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('web/signin')
  async webSignIn(@Body() userCredentialDto: UserCredentialsDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(userCredentialDto, 'web');
  }

  @Post('app/signin')
  async appSignIn(@Body() userCredentialDto: UserCredentialsDto): Promise<{ accessToken: string }> {
    return await this.authService.signIn(userCredentialDto, 'app');
  }

  @UseGuards(RefreshJwtGuard)
  @Post('web/refresh')
  async webRefreshToken(userCredentialDto: UserCredentialsDto) {
    return this.authService.refreshToken(userCredentialDto, 'web');
  }

  @UseGuards(RefreshJwtGuard)
  @Post('app/refresh')
  async appRefreshToken(@Body() userCredentialDto: UserCredentialsDto) {
    return this.authService.refreshToken(userCredentialDto, 'app');
  }
}
