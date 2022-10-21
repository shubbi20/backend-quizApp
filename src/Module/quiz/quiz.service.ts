import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { Ques, Quiz } from 'src/db/entities/quiz.entity';
import { User } from 'src/db/entities/user.entity';
import * as lodash from 'lodash';
import { QuizAttempt } from 'src/db/entities/attempt-quiz.entity';

@Injectable()
export class QuizService {
  async createQuiz({
    title,
    questions,
    email,
  }: {
    title: string;
    questions: Ques[];
    email: string;
  }) {
    const user = await User.findOneBy({
      email: email,
    });

    if (!user) {
      throw new NotFoundException(`User with this email:${email} is not found`);
    }

    let permalink = QuizService.getRandomPermaLink();

    while (true) {
      const q = await Quiz.findOne({ where: { permalink } });
      if (q) permalink = QuizService.getRandomPermaLink();
      else break;
    }

    const quiz = new Quiz();
    quiz.title = title;
    quiz.isPublish = false;
    quiz.permalink = permalink;
    quiz.createdBy = user;
    quiz.questions = questions;

    const quizSave = await quiz.save();

    return {
      msg: 'Successfull',
      quiz: quizSave.id,
    };
  }

  async getDraftQuiz(id: number) {
    let quizData = await Quiz.createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.createdBy', 'createdBy')
      .where('quiz.createdBy.id = :userId', {
        userId: id,
      })
      .andWhere('quiz.isPublish = :published', {
        published: false,
      })
      .getMany();

    return {
      msg: 'successful',
      data: quizData,
    };
  }

  async getPublishQuiz(id: number) {
    let quizData = await Quiz.createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.createdBy', 'createdBy')
      .where('quiz.createdBy.id = :userId', {
        userId: id,
      })
      .andWhere('quiz.isPublish = :published', {
        published: true,
      })
      .getMany();

    return {
      msg: 'successful',
      data: quizData,
    };
  }

  async updateQuiz({
    id,
    title,
    questions,
    userid,
  }: {
    id: number;
    title?: string;
    questions?: Ques[];
    userid: number;
  }) {
    const quiz = await Quiz.createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.createdBy', 'createdBy')
      .where('quiz.id = :Id', {
        Id: id,
      })
      .getOne();

    if (!quiz) {
      throw new HttpException(`Quiz with this id:${id} is not found`, 404);
    }

    if (quiz.isPublish) {
      throw new HttpException('cannot update already publish quiz', 403);
    }

    if (quiz.createdBy.id !== userid) {
      throw new HttpException('User can only update his own quizes', 403);
    }

    const quizUpdate = await Quiz.update(id, {
      title: title,
      questions: questions,
    });

    return {
      msg: 'successful',
      data: quizUpdate,
    };
  }

  async publishQuiz({ id, userid }: { id: number; userid: number }) {
    const quiz = await Quiz.createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.createdBy', 'createdBy')
      .where('quiz.id = :Id', {
        Id: id,
      })
      .getOne();

    if (!quiz) {
      throw new HttpException(`Quiz with this id:${id} is not found`, 404);
    }

    if (quiz.createdBy.id !== userid) {
      throw new HttpException('User can only update his own quizes', 403);
    }

    if (quiz.isPublish) {
      throw new HttpException('cannot update already publish quiz', 403);
    }

    const quizUpdate = await Quiz.update(id, {
      isPublish: true,
    });

    return {
      msg: 'successful',
      data: quizUpdate,
    };
  }

  async deleteQuiz({ id, userid }: { id: number; userid: number }) {
    const quiz = await Quiz.createQueryBuilder('quiz')
      .leftJoinAndSelect('quiz.createdBy', 'createdBy')
      .where('quiz.id = :Id', {
        Id: id,
      })
      .getOne();

    if (!quiz) {
      throw new HttpException(`Quiz with this id:${id} is not found`, 404);
    }

    if (quiz.createdBy.id !== userid) {
      throw new HttpException('User can only update his own quizes', 403);
    }

    const quizDelete = await Quiz.delete(id);

    return {
      msg: 'successful',
      data: quizDelete,
    };
  }

  async getQuizByPermalink({ permalink }: { permalink: string }) {
    let quizData = await Quiz.createQueryBuilder('quiz')
      .where('quiz.permalink = :perma', {
        perma: permalink,
      })
      .getOne();

    return {
      msg: 'successful',
      data: quizData,
    };
  }

  async getTestQuiz({ permalink }: { permalink: string }) {
    let quizData = await Quiz.createQueryBuilder('quiz')
      .where('quiz.permalink = :perma', {
        perma: permalink,
      })
      .getOne();

    quizData.questions = quizData.questions.map((ele) => {
      return {
        ...ele,
        answer: [],
        type: ele.answer.length > 1 ? 'multiple' : 'single',
      };
    });

    return {
      msg: 'successful',
      data: quizData,
    };
  }

  async evaluateQuiz({
    permalink,
    questions,
    role,
    email,
  }: {
    permalink: string;
    questions: Ques[];
    role: string;
    email?: string;
  }) {
    let quizData = await Quiz.createQueryBuilder('quiz')
      .where('quiz.permalink = :perma', {
        perma: permalink,
      })
      .getOne();

    if (!quizData) {
      throw new HttpException(`quiz not found`, 404);
    }

    let correct = 0;
    let wrong = 0;
    const totalScore = quizData.questions.length;
    if (quizData) {
      for (const i in questions) {
        if (questions[i].answer && questions[i].answer.length > 0) {
          const chosenOptions = questions[i].answer;
          const correctOptions = quizData.questions[i].answer;
          if (lodash.isEqual(chosenOptions.sort(), correctOptions.sort())) {
            correct++;
          }
        } else {
          wrong++;
        }
      }
    }

    if (role === 'user') {
      const attemptQuiz = await QuizAttempt.findOneBy({
        email: email,
        permalink: permalink,
      });

      if (!attemptQuiz) {
        const quizAttempt = new QuizAttempt();
        quizAttempt.email = email;
        quizAttempt.permalink = permalink;
        quizAttempt.lastScore = correct;
        quizAttempt.highestScore = correct;

        const quizAttemptSave = await quizAttempt.save();
      } else {
        const quizUpdate = await QuizAttempt.update(attemptQuiz.id, {
          attemptCount: attemptQuiz.attemptCount + 1,
          lastScore: correct,
          highestScore: Math.max(attemptQuiz.highestScore, correct),
        });
      }
    }

    return {
      msg: 'successfull',
      correct: correct,
      total: totalScore,
    };
  }

  private static getRandomPermaLink(): string {
    return (
      Math.random().toString(36).substr(2, 5) + Math.floor(Math.random() * 10)
    );
  }
}
