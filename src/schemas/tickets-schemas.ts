import Joi from 'joi';

export const createEnrollmentSchema = Joi.object({
  ticketTypeId: Joi.number().required(),
});
