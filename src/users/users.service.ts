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

  async signIn(userCredentialsDto: UserCredentialsDto): Promise<void> {
    const {email, password} = userCredentialsDto;
    const user = await this.usersRepository.findOne({ where: { email: email}});

    if (user && (await bcrypt.compare(password, user.password))) {
      // add payload
      // get accessToken
      // return {accessToken}
    }
    else
      throw new UnauthorizedException('Please check your login credentials'); // change exception
  }
}
