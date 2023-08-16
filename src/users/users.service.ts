import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserCredentialsDto } from "./dto/user-credentials.dto";
import * as bcrypt from 'bcrypt';
import { User } from "./user.entity";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userCredentialsDto.password, salt);
    userCredentialsDto.password = hashedPassword;
    try {
      await this.usersRepository.save(userCredentialsDto);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
