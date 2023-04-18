import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { getTicketsTypes, getAllUserTickets, createNewTicket } from '@/controllers';
import { createTicketSchema } from '@/schemas';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', getAllUserTickets)
  .post('/', validateBody(createTicketSchema), createNewTicket)
  .get('/types', getTicketsTypes);

export { ticketsRouter };
