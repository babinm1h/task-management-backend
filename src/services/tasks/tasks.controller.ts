import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Delete,
  Param,
  Put,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { CreateTaskDto, UpdateTaskDto } from './dtos/task.dtos';
import { TasksService } from './tasks.service';

@Controller('/tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @UseGuards(JwtGuard)
  @Post('/create')
  async create(@Body() dto: CreateTaskDto, @Request() req) {
    return this.tasksService.create({
      ...dto,
      user: new Types.ObjectId(req.user._id),
    });
  }

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  async delete(@Param('id') id: Types.ObjectId) {
    return this.tasksService.delete(new Types.ObjectId(id));
  }

  @UseGuards(JwtGuard)
  @Put('/update/:id')
  async update(
    @Param('id') id: Types.ObjectId,
    @Body() dto: Exclude<UpdateTaskDto, 'id'>,
    @Request() req,
  ) {
    return this.tasksService.update(
      {
        ...dto,
        id: new Types.ObjectId(id),
        columnId: new Types.ObjectId(dto.columnId),
      },
      new Types.ObjectId(req.user._id),
    );
  }
}
