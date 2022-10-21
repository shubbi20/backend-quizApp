import { Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserController } from './Module/user/user.controller';
import { UserService } from './Module/user/user.service';
import { QuizController } from './Module/quiz/quiz.controller';
import { QuizService } from './Module/quiz/quiz.service';
import { AttemptQuizController } from './Module/attempt-quiz/attempt-quiz.controller';
import { AttemptQuizService } from './Module/attempt-quiz/attempt-quiz.service';

const PATH = __dirname + '/db/entities/*.entity{.ts,.js}';

export const sqliteDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.db',
  entities: [PATH],
  synchronize: true,
});

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'database.db',
      entities: [PATH],
      synchronize: true,
    }),
  ],
  controllers: [
    AppController,
    UserController,
    QuizController,
    AttemptQuizController,
  ],
  providers: [AppService, UserService, QuizService, AttemptQuizService],
})
export class AppModule {}
