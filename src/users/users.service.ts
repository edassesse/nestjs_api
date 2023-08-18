import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserCredentialsDto } from './dto/user-credentials.dto';
import * as bcrypt from 'bcrypt';
import * as sgMail from '@sendgrid/mail';
import { User } from './user.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async signUp(userCredentialsDto: UserCredentialsDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userCredentialsDto.password, salt);
    const verificationToken = await bcrypt.hash(userCredentialsDto.email, salt);

    try {
      await this.usersRepository.save({
        email: userCredentialsDto.email,
        password: hashedPassword,
        verificationToken: verificationToken,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
    this.sendEmail(userCredentialsDto.email, verificationToken);
  }

  sendEmail(toEmail: string, verificationToken: string): void {
    const templatePath = 'email-templates/verification.html';
    const verificationLink = `http://localhost:3000/users/verify/${verificationToken}`;
    console.log(`|{__dirname}|{templatePath}`);
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = template
      .replace('{{username}}', toEmail)
      .replace('{{verificationLink}}', verificationLink);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: toEmail,
      from: 'dassesseernest@gmail.com',
      subject: 'Verify your email',
      html: html,
    };
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async verifyEmail(verificationToken: string): Promise<void> {
    try {
      const user: User = await this.usersRepository.findOneBy({
        verificationToken: verificationToken,
      });
      user.isVerified = true;
      console.log(user);
      this.usersRepository.save(user);
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
