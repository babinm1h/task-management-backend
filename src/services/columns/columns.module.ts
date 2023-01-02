import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Column, ColumnSchema } from 'src/schemas/column.schema';
import { Project, ProjectSchema } from 'src/schemas/project.schema';
import { Task, TaskSchema } from 'src/schemas/task.schema';
import { User, UserSchema } from 'src/schemas/user.schema';
import { ColumnsController } from './columns.controller';
import { ColumnsService } from './columns.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Task.name, schema: TaskSchema }]),
    MongooseModule.forFeature([{ name: Project.name, schema: ProjectSchema }]),
    MongooseModule.forFeature([{ name: Column.name, schema: ColumnSchema }]),
  ],
  providers: [ColumnsService],
  controllers: [ColumnsController],
})
export class ColumnsModule {}
