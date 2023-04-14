import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicketsTypes, getAllUserTickets, createNewTicket } from '@/controllers';

const ticketsRouter = Router();

ticketsRouter
  .all('/*', authenticateToken)
  .get('/', getAllUserTickets)
  .post('/', createNewTicket)
  .get('/types', getTicketsTypes);

export { ticketsRouter };
