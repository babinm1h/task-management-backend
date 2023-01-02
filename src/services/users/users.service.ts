import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async getById(id: Types.ObjectId) {
    const user = await this.UserModel.findById(id);
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
