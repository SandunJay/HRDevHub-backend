import Joi from 'joi';
import { body } from 'express-validator';

export const createValidation = (data) => {
  const schema = Joi.object({
    employeeID: Joi.string().required(),
    uniqueID: Joi.string().required(),
    createdDate: Joi.date().required(),
  });

  return schema.validate(data);
};


export const createQRCodeValidation = [
  body('employeeID').isString().notEmpty(),
];