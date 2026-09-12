import Joi from 'joi';

export const createProjectSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(1000).optional().allow(''),
    client_id: Joi.number().integer().optional().allow(null),
    status: Joi.string().valid('Planning', 'Active', 'On Hold', 'Completed').optional(),
});

export const updateProjectSchema = Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    description: Joi.string().max(1000).optional().allow(''),
    client_id: Joi.number().integer().optional().allow(null),
    status: Joi.string().valid('Planning', 'Active', 'On Hold', 'Completed').optional(),
});
