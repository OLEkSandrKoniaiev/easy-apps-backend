import Joi from 'joi';

export const createTaskSchema = Joi.object({
  title: Joi.string().min(2).max(255).required().messages({
    'string.empty': 'Title cannot be empty.',
    'string.min': 'Title should have a minimum length of {#limit}.',
    'string.max': 'Title should have a maximum length of {#limit}.',
    'any.required': 'Title is a required field.',
  }),

  description: Joi.string().max(4096).messages({
    'string.max': 'Description should have a maximum length of {#limit}.',
  }),
});
