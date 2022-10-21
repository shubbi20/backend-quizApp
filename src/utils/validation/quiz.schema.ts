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
        .max(5)
        .required(),
      options: Joi.array()
        .items(
          Joi.string().trim().min(1).lowercase().required(),
          Joi.string().min(1).lowercase(),
        )
        .max(5)
        .min(2)
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

export const evaluateSchema = Joi.object()
  .options({ abortEarly: true })
  .keys({
    questions: Joi.array()
      .options({ abortEarly: true })
      .items({
        questionNo: Joi.number().min(1).required(),
        ques: Joi.string().trim().min(5).max(200).required().label('question'),
        answer: Joi.array()
          .items(Joi.string().trim().lowercase().required())
          .min(1)
          .unique()
          .required()
          .label('answer'),
        options: Joi.array()
          .items(
            Joi.string().trim().min(1).lowercase().required(),
            Joi.string().min(1).lowercase(),
          )
          .required()
          .unique()
          .label('options'),
        type: Joi.string().optional(),
      })
      .max(10)
      .min(1)
      .unique('ques')
      .required(),
    role: Joi.string().valid('user', 'non-user').required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .optional(),
    permalink: Joi.string().min(6).required(),
  });

export const quizEvaluateValidation = ({
  questions,
  permalink,
  role,
  email,
}: {
  questions: Ques[];
  permalink: string;
  role: string;
  email?: string;
}) => {
  const { value, error } = evaluateSchema.validate({
    questions,
    permalink,
    role,
    email,
  });
  if (error) {
    throw new UnauthorizedException(error.message);
  } else {
    return value;
  }
};
