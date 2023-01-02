import {
  NotFoundException,
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async validateUser({ email, password }: AuthDto) {
    const user = await this.userModel.findOne({ email });
    if (!user) throw new NotFoundException('User with this email not found');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new BadRequestException('Wrong password');

    return user;
  }

  async register({ email, password }: AuthDto) {
    const candidate = await this.userModel.findOne({ email });
    if (candidate) {
      throw new BadRequestException('User with this email already exist');
    }

    const hashedPass = await bcrypt.hash(password, 7);
    const user = await this.userModel.create({ email, password: hashedPass });

    const payload = { _id: user._id };
    const token = this.jwtService.sign(payload, { expiresIn: '30d' });
    return { user, token };
  }

  async login(user: UserDocument) {
    const payload = { _id: user._id };
    const token = this.jwtService.sign(payload, { expiresIn: '30d' });
    return { user, token };
  }
}
