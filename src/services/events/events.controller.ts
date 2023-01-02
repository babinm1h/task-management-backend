import {
  Controller,
  Get,
  UseGuards,
  Request,
  Post,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateEventDto } from './dtos/events.dtos';
import { EventsService } from './events.service';

@Controller('/events')
export class EventsController {
  constructor(private eventsService: EventsService) {}

  @UseGuards(JwtGuard)
  @Get('')
  async getEvents(@Request() req) {
    return this.eventsService.getAll(new Types.ObjectId(req.user._id));
  }

  @UseGuards(JwtGuard)
  @Post('/create')
  async create(@Request() req, @Body() dto: CreateEventDto) {
    return this.eventsService.create(dto, new Types.ObjectId(req.user.id));
  }

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  async delete(@Request() req, @Param('id') id: string) {
    return this.eventsService.delete(
      new Types.ObjectId(req.user.id),
      new Types.ObjectId(id),
    );
  }
}
