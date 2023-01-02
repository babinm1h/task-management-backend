import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './services/auth/auth.module';
import { ColumnsModule } from './services/columns/columns.module';
import { EventsModule } from './services/events/events.module';
import { ProjectsModule } from './services/projects/projects.module';
import { TasksModule } from './services/tasks/tasks.module';
import { UsersModule } from './services/users/users.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UsersModule,
    AuthModule,
    TasksModule,
    ProjectsModule,
    ColumnsModule,
    EventsModule,
  ],
})
export class AppModule {}
