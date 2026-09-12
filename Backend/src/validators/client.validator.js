import Joi from 'joi';

export const createClientSchema = Joi.object({
    name: Joi.string().min(2).max(255).required(),
    contact_email: Joi.string().email().optional().allow('', null),
    contact_phone: Joi.string().max(50).optional().allow('', null),
    company_name: Joi.string().max(255).optional().allow('', null),
});

export const updateClientSchema = Joi.object({
    name: Joi.string().min(2).max(255).optional(),
    contact_email: Joi.string().email().optional().allow('', null),
    contact_phone: Joi.string().max(50).optional().allow('', null),
    company_name: Joi.string().max(255).optional().allow('', null),
});
