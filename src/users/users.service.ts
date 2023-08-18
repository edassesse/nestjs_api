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

    try {
      await this.usersRepository.save({
        email: userCredentialsDto.email,
        password: hashedPassword,
      });
    } catch (error) {
      throw new InternalServerErrorException();
    }
    this.sendEmail(userCredentialsDto.email);
  }

  async sendEmail(toEmail: string): Promise<void> {
    const verificationToken = (await this.usersRepository.findOneBy({ email: toEmail })).id;
    const templatePath = 'email-templates/verification.html';
    const verificationLink = `http://localhost:3000/users/verify/${verificationToken}`;
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
    try {
      sgMail.send(msg);
      console.log('Email sent');
    } catch (error) {
      console.log(error);
    }
  }

  async verifyEmail(verificationToken: string): Promise<string> {
    try {
      const user: User = await this.usersRepository.findOneBy({
        id: verificationToken,
      });
      user.isVerified = true;
      this.usersRepository.save(user);
      return `<!DOCTYPE html>
        <html>
        <head>
            <title> Email Verification</title>
        </head>
        <body>
            <div>
                <h1>Email Verified</h1>
                <p>Your email has been successfully verified. Thank you!</p>
            </div>
        </body>
        </html>`;
    } catch (error) {
      return `<!DOCTYPE html>
        <html>
        <head>
            <title>Email Verification</title>
        </head>
        <body>
            <div>
                <h1>Email Verification Failed</h1>
                <p>There was an error during email verification.</p>
            </div>
        </body>
        </html>`;
    }
  }
}
