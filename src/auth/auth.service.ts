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

  async signIn(
    userCredentialsDto: UserCredentialsDto,
    origin: 'web' | 'app',
  ): Promise<{ accessToken: string; refreshToken: any }> {
    let found: User;

    try {
      found = await this.usersRepository.findOneBy({ email: userCredentialsDto.email });
      return this.createAccessToken(found, origin);
    } catch {
      throw NotFoundException;
    }
  }

  async createAccessToken(
    user: User,
    origin: 'web' | 'app',
  ): Promise<{ accessToken: string; refreshToken: any }> {
    const payload: JwtPayload = { email: user.email, origin: origin };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken, refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }) };
  }

  async refreshToken(userCredentialsDto: UserCredentialsDto, origin: 'web' | 'app') {
    let user: User;

    try {
      user = await this.usersRepository.findOneBy({ email: userCredentialsDto.email });
    } catch {
      throw new NotFoundException;
    }
    const payload: JwtPayload = { email: user.email, origin: origin };
    const accessToken: string = this.jwtService.sign(payload);
    return { accessToken };
  }
}
