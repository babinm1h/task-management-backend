import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Column, ColumnDocument } from 'src/schemas/column.schema';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { Task, TaskDocument } from 'src/schemas/task.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import {
  reorderArrElemToAnother,
  reorderSameArrElem,
} from 'src/utils/arrayReorderElement';
import { CreateTaskDto, UpdateTaskDto } from './dtos/task.dtos';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private TaskModel: Model<TaskDocument>,
    @InjectModel(User.name) private UserModel: Model<UserDocument>,
    @InjectModel(Project.name) private ProjectModel: Model<ProjectDocument>,
    @InjectModel(Column.name) private ColumnModel: Model<ColumnDocument>,
  ) {}

  async create(dto: CreateTaskDto & { user: Types.ObjectId }) {
    const col = await this.ColumnModel.findById(
      new Types.ObjectId(dto.columnId),
    );
    if (!col) throw new NotFoundException('Column not found');

    const created = await this.TaskModel.create({
      ...dto,
      column: dto.columnId,
      index: col.tasks.length,
    });

    if (col) {
      col.tasks.push(created._id);
      await col.save();

      await this.ProjectModel.findByIdAndUpdate(col.project, {
        $inc: { tasksCount: 1 },
      });
    }

    return created;
  }

  async update(dto: UpdateTaskDto, userId: Types.ObjectId) {
    const task = await this.TaskModel.findById(dto.id).populate('user', '_id');
    if (!task) throw new NotFoundException('Task not found');
    if (String(task.user._id) !== String(userId)) {
      throw new ForbiddenException('Forbidden to update');
    }

    if (dto.text) task.text = dto.text;
    if (dto.deadline) task.deadline = dto.deadline;
    if (dto.completed !== undefined) task.completed = dto.completed;
    if (dto.columnId) {
      const oldCol = await this.ColumnModel.findById(task.column);
      if (dto.columnId + '' !== task.column + '') {
        oldCol.tasks = oldCol.tasks.filter((c) => `${c}` !== `${task._id}`);
        await oldCol.save();

        const newCol = await this.ColumnModel.findById(dto.columnId);
        newCol.tasks = reorderArrElemToAnother<Types.ObjectId>(
          newCol.tasks,
          task._id,
          dto.toIndex,
        );
        await newCol.save();

        task.column = dto.columnId;
        await task.save();
      } else {
        oldCol.tasks = reorderSameArrElem(
          oldCol.tasks,
          dto.fromIndex,
          dto.toIndex,
        );
        await oldCol.save();
      }
    }
    await task.save();
    return task;
  }

  async delete(id: Types.ObjectId) {
    const task = await this.TaskModel.findByIdAndDelete(id).populate(
      'column',
      '_id',
    );
    if (!task) throw new NotFoundException('Task not found');

    const col = await this.ColumnModel.findById(task.column._id);
    if (!col) throw new NotFoundException('Column not found');
    col.tasks = col.tasks.filter((taskId) => String(taskId) !== String(id));
    await col.save();

    await this.ProjectModel.findByIdAndUpdate(col.project, {
      $inc: { tasksCount: -1 },
    });

    return task;
  }
}
