import Joi from 'joi';

export const createTaskSchema = Joi.object({
    title: Joi.string().min(2).max(255).required(),
    description: Joi.string().max(2000).optional().allow(''),
    project_id: Joi.number().integer().required(),
    assigned_to: Joi.number().integer().optional().allow(null),
    status: Joi.string().valid('To Do', 'In Progress', 'In Review', 'Done', 'Overdue').optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
    due_date: Joi.date().iso().optional().allow(null),
});

export const updateTaskSchema = Joi.object({
    title: Joi.string().min(2).max(255).optional(),
    description: Joi.string().max(2000).optional().allow(''),
    project_id: Joi.number().integer().optional(),
    assigned_to: Joi.number().integer().optional().allow(null),
    status: Joi.string().valid('To Do', 'In Progress', 'In Review', 'Done', 'Overdue').optional(),
    priority: Joi.string().valid('Low', 'Medium', 'High', 'Critical').optional(),
    due_date: Joi.date().iso().optional().allow(null),
});

export const updateTaskStatusSchema = Joi.object({
    status: Joi.string().valid('To Do', 'In Progress', 'In Review', 'Done', 'Overdue').required(),
});
