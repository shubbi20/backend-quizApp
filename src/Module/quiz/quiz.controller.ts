import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Ques } from 'src/db/entities/quiz.entity';
import { Auth, IAuth } from 'src/utils/auth.decorator';
import { AuthGuard } from 'src/utils/guard/auth.guard';
import {
  quizEvaluateValidation,
  quizUpdateValidation,
  quizValidation,
} from 'src/utils/validation/quiz.schema';
import { QuizService } from './quiz.service';

@Controller('/quiz')
export class QuizController {
  constructor(private readonly quizService: QuizService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createQuiz(
    @Auth() authUser: IAuth,
    @Body() { title, questions }: { title: string; questions: Ques[] },
  ) {
    const valid = quizValidation({ title, questions });
    return this.quizService.createQuiz({
      title,
      questions,
      email: authUser.email,
    });
  }

  @Get()
  @UseGuards(AuthGuard)
  async getDraftQuiz(@Auth() authUser: IAuth) {
    return this.quizService.getDraftQuiz(authUser.id);
  }

  @Get('/publish')
  @UseGuards(AuthGuard)
  async getPublishQuiz(@Auth() authUser: IAuth) {
    return this.quizService.getPublishQuiz(authUser.id);
  }

  @Patch('/:id')
  @UseGuards(AuthGuard)
  async updateQuiz(
    @Auth() authUser: IAuth,
    @Param('id', new ParseIntPipe()) id,
    @Body() { title, questions }: { title?: string; questions?: Ques[] },
  ) {
    const valid = quizUpdateValidation({ title, questions });
    return this.quizService.updateQuiz({
      id,
      title,
      questions,
      userid: authUser.id,
    });
  }

  @Patch('/publish/:id')
  @UseGuards(AuthGuard)
  async publishQuiz(
    @Auth() authUser: IAuth,
    @Param('id', new ParseIntPipe()) id,
  ) {
    return this.quizService.publishQuiz({
      id,
      userid: authUser.id,
    });
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  async deleteQuiz(
    @Auth() authUser: IAuth,
    @Param('id', new ParseIntPipe()) id,
  ) {
    return this.quizService.deleteQuiz({
      id,
      userid: authUser.id,
    });
  }

  @Get('/:permalink')
  @UseGuards(AuthGuard)
  async getQuizByPermalink(
    @Auth() authUser: IAuth,
    @Param('permalink') permalink,
  ) {
    return this.quizService.getQuizByPermalink({
      permalink,
    });
  }

  @Get('/testquiz/:permalink')
  async getTestQuiz(@Param('permalink') permalink) {
    return this.quizService.getTestQuiz({
      permalink,
    });
  }

  @Post('/evaluate')
  async evaluateQuiz(
    @Body()
    {
      questions,
      permalink,
      role,
      email,
    }: {
      questions: Ques[];
      permalink: string;
      role: string;
      email?: string;
    },
  ) {
    const valid = quizEvaluateValidation({ questions, permalink, role, email });

    return this.quizService.evaluateQuiz({ permalink, questions, role, email });
  }
}
