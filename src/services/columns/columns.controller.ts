import {
  Body,
  Controller,
  Delete,
  Post,
  UseGuards,
  Request,
  Param,
  Put,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { JwtGuard } from '../auth/guard/jwt.guard';
import { ColumnsService } from './columns.service';
import { createColumnDto } from './dtos/column.dtos';

@Controller('columns')
export class ColumnsController {
  constructor(private columnsService: ColumnsService) {}

  @UseGuards(JwtGuard)
  @Put('update/:id')
  async update(@Param('id') id: string, @Body('name') name: string) {
    return await this.columnsService.update({ name, columnId: id });
  }

  @UseGuards(JwtGuard)
  @Post('/create')
  async create(@Body() dto: createColumnDto) {
    return await this.columnsService.create({
      name: dto.name,
      projectId: new Types.ObjectId(dto.projectId),
    });
  }

  @UseGuards(JwtGuard)
  @Delete('/delete/:id')
  async delete(@Param('id') id: string, @Request() req) {
    return await this.columnsService.delete(
      new Types.ObjectId(id),
      new Types.ObjectId(req.user._id),
    );
  }
}
