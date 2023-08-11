import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { AppJwtStrategy } from './app.jwt.strategy';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { WebJwtStrategy } from './web.jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'test',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [AuthService, AppJwtStrategy, WebJwtStrategy],
  controllers: [AuthController],
  exports: [TypeOrmModule],
})
export class AuthModule {}
