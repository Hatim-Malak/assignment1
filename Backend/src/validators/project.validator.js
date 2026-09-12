import Joi from "joi";

export const createProjectSchema = Joi.object({
    name: Joi.string().min(2).max(255).required().messages({
        'string.empty': 'Project name is required',
        'string.min': 'Project name should have a minimum length of 2',
        'string.max': 'Project name should have a maximum length of 255',
        'any.required': 'Project name is required'
    }),
    description: Joi.string().optional().allow(''),
    client_id: Joi.number().integer().required().messages({
        'number.base': 'client_id must be a number',
        'any.required': 'client_id is required'
    })
});

export const updateProjectSchema = Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    description: Joi.string().optional().allow(''),
    client_id: Joi.number().integer().optional()
});
