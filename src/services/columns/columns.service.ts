import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Column, ColumnDocument } from 'src/schemas/column.schema';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { User, UserDocument } from 'src/schemas/user.schema';
import { createColumnDto, updateColumnDto } from './dtos/column.dtos';

@Injectable()
export class ColumnsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    @InjectModel(Column.name)
    private readonly columnModel: Model<ColumnDocument>,
  ) {}

  async create({ name, projectId }: createColumnDto) {
    const proj = await this.projectModel.findById(projectId);
    if (!proj) throw new NotFoundException('Project not found');
    const col = await this.columnModel.create({ name, project: proj._id });

    proj.columns.push(col._id);
    await proj.save();
    return col;
  }

  async update({ columnId, name }: updateColumnDto) {
    const col = await this.columnModel.findByIdAndUpdate(
      new Types.ObjectId(columnId),
      { $set: { name } },
      { new: true },
    );
    return await col.save();
  }

  async delete(colId: Types.ObjectId, userId: Types.ObjectId) {
    const col = await this.columnModel.findByIdAndDelete(colId);
    if (!col) throw new NotFoundException('Column not found');

    const proj = await this.projectModel.findById(col.project);
    if (!proj) {
      throw new NotFoundException('Project with this column not found');
    }
    if (String(proj.user) !== String(userId)) {
      throw new ForbiddenException('Forbidden');
    }

    proj.columns = proj.columns.filter((id) => String(id) !== String(colId));
    proj.tasksCount -= col.tasks.length;
    await proj.save();

    return col;
  }
}
