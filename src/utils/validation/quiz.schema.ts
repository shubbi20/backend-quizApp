import { UnauthorizedException } from '@nestjs/common';
import * as Joi from 'joi';
import { Ques } from 'src/db/entities/quiz.entity';

export const quizSchema = Joi.object().keys({
  title: Joi.string().trim().min(3).required(),
  questions: Joi.array()
    .options({ abortEarly: true })
    .items({
      questionNo: Joi.number().min(1).required(),
      ques: Joi.string().trim().min(5).max(200).required(),
      answer: Joi.array()
        .items(Joi.string().trim().lowercase().required())
        .min(1)
        .unique()
        .required(),
      options: Joi.array()
        .items(
          Joi.string().trim().min(1).lowercase().required(),
          Joi.string().min(1).lowercase(),
        )
        .required()
        .unique(),
    })
    .max(10)
    .min(1)
    .unique('ques')
    .required(),
});

export const quizValidation = ({
  title,
  questions,
}: {
  title: string;
  questions: Ques[];
}) => {
  const { value, error } = quizSchema.validate({ title, questions });
  if (error) {
    throw new UnauthorizedException(error.message);
  } else {
    return value;
  }
};

export const quizUpdateSchema = Joi.object().keys({
  title: Joi.string().trim().min(3).optional(),
  questions: Joi.array()
    .options({ abortEarly: true })
    .items({
      questionNo: Joi.number().min(1).required(),
      ques: Joi.string().trim().min(5).max(200).required(),
      answer: Joi.array()
        .items(Joi.string().trim().lowercase().required())
        .min(1)
        .unique()
        .required(),
      options: Joi.array()
        .items(
          Joi.string().trim().min(1).lowercase().required(),
          Joi.string().min(1).lowercase(),
        )
        .required()
        .unique(),
    })
    .max(10)
    .min(1)
    .unique('ques')
    .optional(),
});

export const quizUpdateValidation = ({
  title,
  questions,
}: {
  title?: string;
  questions?: Ques[];
}) => {
  const { value, error } = quizUpdateSchema.validate({ title, questions });
  if (error) {
    throw new UnauthorizedException(error.message);
  } else {
    return value;
  }
};
