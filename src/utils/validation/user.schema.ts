import { UnauthorizedException } from '@nestjs/common';
import * as Joi from 'joi';

const signupSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string().trim().min(3).max(24).required(),
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .min(7)
      .max(24)
      .required(),
    password: Joi.string().trim().min(5).max(24).required(),
  })
  .unknown();

const loginSchema = Joi.object()
  .options({ abortEarly: false })
  .keys({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .trim()
      .min(7)
      .max(24)
      .required(),
    password: Joi.string().trim().min(5).max(24).required(),
  })
  .unknown();

export const signupValidation = ({
  email,
  password,
  name,
}: {
  email: string;
  password: string;
  name: string;
}) => {
  const { value, error } = signupSchema.validate({ email, password, name });
  if (error) {
    throw new UnauthorizedException(error.message);
  } else {
    return value;
  }
};

export const loginValidation = ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const { value, error } = loginSchema.validate({ email, password });
  if (error) {
    throw new UnauthorizedException(error.message);
  } else {
    return value;
  }
};
