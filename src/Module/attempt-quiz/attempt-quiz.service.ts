import { HttpException, Injectable } from '@nestjs/common';
import { QuizAttempt } from 'src/db/entities/attempt-quiz.entity';

@Injectable()
export class AttemptQuizService {
  async getAttemptQuiz({
    permalink,
    email,
  }: {
    permalink: string;
    email: string;
  }) {
    const attemptQuiz = await QuizAttempt.findOneBy({
      email: email,
      permalink: permalink,
    });

    return {
      msg: 'Successfull',
      data: attemptQuiz,
    };
  }

  async deleteAttemptQuiz(id: number) {
    const attemptQuiz = await QuizAttempt.delete(id);

    return {
      msg: 'Successfull',
      data: attemptQuiz,
    };
  }
}
