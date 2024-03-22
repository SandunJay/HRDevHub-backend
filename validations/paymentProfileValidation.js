import Joi from 'joi';

// Validation schema for creating a Payment Profile
export const createPaymentProfileSchema = Joi.object({
  employeeID: Joi.string().required(),
  base_salary: Joi.number().required(),
  allowances: Joi.number(),
  description: Joi.string(),
});

// Validation schema for updating a Payment Profile
export const updatePaymentProfileSchema = Joi.object({
  employeeID: Joi.string().required(),
  base_salary: Joi.number().required(),
  allowances: Joi.number(),
  description: Joi.string(),
});


export function validatePaymentProfile(profile) {
  const schema = Joi.object({
    employeeID: Joi.string().required(),
    base_salary: Joi.number().required(),
    allowances: Joi.number().required(),
    description: Joi.string().required(),
  });

  return schema.validate(profile);
}
