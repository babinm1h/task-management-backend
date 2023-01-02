import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Column, ColumnDocument } from 'src/schemas/column.schema';
import { Project, ProjectDocument } from 'src/schemas/project.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
    @InjectModel(Column.name)
    private readonly ColumnModel: Model<ColumnDocument>,
  ) {}

  async create({ name, userId }: { name: string; userId: Types.ObjectId }) {
    const proj = await this.projectModel.create({ name, user: userId });
    const owner = await this.UserModel.findById(userId);
    owner.projects.unshift(proj._id);
    await owner.save();
    return proj;
  }

  async getAll(userId: Types.ObjectId) {
    const all = await this.projectModel
      .find({ user: userId })
      .sort({ createdAt: 'desc' });
    await this.projectModel.populate(all, { path: 'columns' });
    return all;
  }

  async getById(projId: Types.ObjectId) {
    let proj = await this.projectModel.findById(projId).populate('columns');
    proj = (await this.ColumnModel.populate(proj, {
      path: 'columns.tasks',
    })) as any;
    return proj;
  }

  async delete(id: Types.ObjectId, userId: Types.ObjectId) {
    const proj = await this.projectModel.findByIdAndDelete(id);
    if (!proj) throw new BadRequestException('Project not found');
    if (String(proj.user) !== String(userId)) {
      throw new ForbiddenException('Forbidden to delete this project');
    }

    const owner = await this.UserModel.findById(userId);
    owner.projects.filter((projId) => String(projId) !== String(id));
    await owner.save();

    return proj;
  }
}
