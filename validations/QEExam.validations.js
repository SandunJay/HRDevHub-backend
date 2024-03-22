import { Joi } from 'celebrate'

export const QEExamSchema = Joi.object({
  ExamType: Joi.string().required(),
  InvigilatorEmpID: Joi.string().required(),
  Location: Joi.string().required(),
  StartTimestamp: Joi.date().timestamp().required(),
  EndTimestamp: Joi.date().timestamp().required(),
  Materials: Joi.string().required(),
  Questions: Joi.string().required(),
})
