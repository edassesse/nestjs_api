import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { AppJwtStrategy } from './app.jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RefreshJwtStrategy } from './refreshToken.strategy';
import { WebJwtStrategy } from './web.jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'test',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [AuthService, AppJwtStrategy, WebJwtStrategy, RefreshJwtStrategy],
  controllers: [AuthController],
  exports: [TypeOrmModule],
})
export class AuthModule {}
