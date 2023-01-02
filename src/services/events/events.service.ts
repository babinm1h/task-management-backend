import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { EventDocument } from 'src/schemas/event.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { CreateEventDto } from './dtos/events.dtos';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<UserDocument>,
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async getAll(userId: Types.ObjectId) {
    const events = await this.eventModel.find({ user: userId });
    return events;
  }

  async create(dto: CreateEventDto, userId: Types.ObjectId) {
    const event = await this.eventModel.create({ ...dto, user: userId });
    return event;
  }

  async delete(userId: Types.ObjectId, eventId: Types.ObjectId) {
    const event = await this.eventModel.findById(eventId);
    if (!event) throw new NotFoundException('Event not found');

    if (`${event.user}` !== `${userId}`) {
      throw new ForbiddenException(
        'Forbidden, this event doesnt belong to you',
      );
    }

    await event.delete();

    return event;
  }
}
