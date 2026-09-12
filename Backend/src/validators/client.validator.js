import Joi from "joi";

export const createClientSchema = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
        'string.empty': 'Client name is required',
        'string.min': 'Client name should have a minimum length of 2',
        'string.max': 'Client name should have a maximum length of 255',
        'any.required': 'Client name is required'
    })
});

export const updateClientSchema = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
        'string.empty': 'Client name cannot be empty',
        'string.min': 'Client name should have a minimum length of 2',
        'string.max': 'Client name should have a maximum length of 255',
        'any.required': 'Client name is required'
    })
});
