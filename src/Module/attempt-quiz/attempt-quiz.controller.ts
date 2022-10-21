import {
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { Auth, IAuth } from 'src/utils/auth.decorator';
import { AuthGuard } from 'src/utils/guard/auth.guard';
import { AttemptQuizService } from './attempt-quiz.service';

@Controller('/attempt')
export class AttemptQuizController {
  constructor(private readonly attemptQuizService: AttemptQuizService) {}

  @Get('/:permalink')
  @UseGuards(AuthGuard)
  async getQuiz(
    @Auth() authUser: IAuth,
    @Param('permalink') permalink: string,
  ) {
    return this.attemptQuizService.getAttemptQuiz({
      permalink,
      email: authUser.email,
    });
  }

  @Delete('/:id')
  async deleteQuiz(@Param('id', new ParseIntPipe()) id) {
    return this.attemptQuizService.deleteAttemptQuiz(id);
  }
}
