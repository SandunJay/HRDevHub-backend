import Joi from 'joi';

// Validation schema for creating a Leave
export const createLeaveSchema = Joi.object({
  employeeID: Joi.string().required(),
  reason: Joi.string().required(),
  date: Joi.string().regex(/^\d{1,2}-\d{1,2}-\d{4}$/).required(), // Accept date in "25-8-2023" format
  description: Joi.string().required(),
  isHandled: Joi.boolean().required(),
  message:Joi.string().required(),
});

// Validation schema for updating a Leave
export const updateLeaveSchema = Joi.object({
  employeeID: Joi.string().required(),
  reason: Joi.string().required(),
  date: Joi.string().regex(/^\d{1,2}-\d{1,2}-\d{4}$/).required(), // Accept date in "25-8-2023" format
  description: Joi.string().required(),
  isHandled: Joi.boolean().required(),
  message:Joi.string().required(),

});

export function validateLeave(profile) {
  const schema = Joi.object({
    employeeID: Joi.string().required(),
    reason: Joi.string().required(),
    date: Joi.string().regex(/^\d{1,2}-\d{1,2}-\d{4}$/).required(), // Accept date in "25-8-2023" format
    description: Joi.string().required(),
    isHandled: Joi.boolean().required(),
    message:Joi.string().required(),


  });

  return schema.validate(profile);
}
