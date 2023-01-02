import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  Request,
  Param,
  Get,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @UseGuards(JwtGuard)
  @Get('/')
  async getAll(@Request() req) {
    return await this.projectsService.getAll(new Types.ObjectId(req.user._id));
  }

  @UseGuards(JwtGuard)
  @Get('/:id')
  async getById(@Param('id') id: string) {
    return await this.projectsService.getById(new Types.ObjectId(id));
  }

  @UseGuards(JwtGuard)
  @Post('/create')
  async create(@Body('name') name: string, @Request() req) {
    return await this.projectsService.create({
      name,
      userId: new Types.ObjectId(req.user._id),
    });
  }

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  async delete(@Param('id') id: string, @Request() req) {
    return await this.projectsService.delete(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user._id),
    );
  }
}
