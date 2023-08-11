import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/users/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AppJwtStrategy extends PassportStrategy(Strategy, 'app') {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'test',
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const email: string = payload.email;
    const user: User = await this.usersRepository.findOneBy({ email: email });
    if (!user || payload.origin != 'app') {
      throw new UnauthorizedException;
    }
    return user;
  }
}
