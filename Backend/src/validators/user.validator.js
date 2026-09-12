import Joi from 'joi';

export const loginSchema = Joi.object({
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).required(),
});

export const createUserSchema = Joi.object({
    username: Joi.string().min(3).max(100).required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('Admin', 'Project Manager', 'Developer').required(),
});
