import Joi from "joi";

export const loginSchema = Joi.object({
    username: Joi.string().required().messages({
        'string.empty': 'Username is required',
        'any.required': 'Username is required'
    }),
    password: Joi.string().required().messages({
        'string.empty': 'Password is required',
        'any.required': 'Password is required'
    })
});

export const createUserSchema = Joi.object({
    username: Joi.string().alphanum().min(3).max(30).required().messages({
        'string.empty': 'Username is required',
        'string.min': 'Username should have a minimum length of 3',
        'string.max': 'Username should have a maximum length of 30',
        'any.required': 'Username is required'
    }),
    password: Joi.string().min(6).required().messages({
        'string.empty': 'Password is required',
        'string.min': 'Password should have a minimum length of 6',
        'any.required': 'Password is required'
    }),
    role: Joi.string().valid('Admin', 'Project Manager', 'Developer').required().messages({
        'any.only': 'Role must be Admin, Project Manager, or Developer',
        'string.empty': 'Role is required',
        'any.required': 'Role is required'
    })
});
