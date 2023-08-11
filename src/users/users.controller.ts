import { Body, Controller, Get, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AppJwtGuard } from 'src/auth/app-jwt.guard';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async signUp(@Body() usersCredentialsDto: UserCredentialsDto): Promise<void> {
    console.log(usersCredentialsDto);
    return this.usersService.signUp(usersCredentialsDto);
  }

  @Get('/app-only')
  @UseGuards(AppJwtGuard)
  async appOnly(@Request() req) {
    const user: User = req.user;
    return user;
  }
}
