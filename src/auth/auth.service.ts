import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredentialsDto } from 'src/users/dto/user-credentials.dto';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async webSignIn(userCredentialsDto: UserCredentialsDto): Promise<{ accessToken: string }> {
    let found: User;

    try {
      found = await this.usersRepository.findOneBy({ email: userCredentialsDto.email });
      const payload: JwtPayload = {email: found.email, origin: 'web'}
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } catch {
      throw new NotFoundException;
    }
  }

  async appSignIn(userCredentialsDto: UserCredentialsDto): Promise<{ accessToken: string }> {
    let found: User;

    try {
      found = await this.usersRepository.findOneBy({ email: userCredentialsDto.email });
      const payload: JwtPayload = {email: found.email, origin: 'app'}
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } catch {
      throw NotFoundException;
    }
  }
}
