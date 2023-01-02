import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Event, EventDocument } from 'src/schemas/event.schema';
import { CreateEventDto, UpdateEventDto } from './dtos/events.dtos';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name)
    private readonly eventModel: Model<EventDocument>,
  ) {}

  async checkEventsAtHour(date: string, time: string, userId: Types.ObjectId) {
    const dayEvs = await this.eventModel.find({ date: date, user: userId });

    const evsAtThisHour = dayEvs.filter(
      (ev) => ev.time.split(':')[0] === time.split(':')[0],
    );

    if (evsAtThisHour.length > 7) {
      throw new BadRequestException('Cant add more than 8 events at one hour');
    }
  }

  async getAll(userId: Types.ObjectId) {
    const events = await this.eventModel.find({ user: userId });
    return events;
  }

  async create(dto: CreateEventDto, userId: Types.ObjectId) {
    await this.checkEventsAtHour(dto.date, dto.time, userId);
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

  async update(dto: UpdateEventDto, userId: Types.ObjectId) {
    await this.checkEventsAtHour(dto.date, dto.time, userId);
    const event = await this.eventModel.findById(new Types.ObjectId(dto.id));
    if (!event) throw new NotFoundException('Event not found');

    if (`${event.user}` !== `${userId}`) {
      throw new ForbiddenException(
        'Forbidden, this event doesnt belong to you',
      );
    }

    if (dto.date) event.date = dto.date;
    if (dto.name) event.name = dto.name;
    if (dto.time) event.time = dto.time;

    await event.save();
    return event;
  }
}
