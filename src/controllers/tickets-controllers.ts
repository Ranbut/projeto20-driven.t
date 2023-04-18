import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import ticketsService from '@/services/tickets-service';

export async function getTicketsTypes(req: AuthenticatedRequest, res: Response) {
  try {
    const ticketsTypes = await ticketsService.getTicketsTypes();

    return res.status(httpStatus.OK).send(ticketsTypes);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getAllUserTickets(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;

  try {
    const tickets = await ticketsService.getAllUserTickets(userId);

    return res.status(httpStatus.OK).send(tickets);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function createNewTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;
  const ticketTypeId = req.body.ticketTypeId as number;

  try {
    const ticketCreated = await ticketsService.createNewTicket(userId, ticketTypeId);

    return res.status(httpStatus.CREATED).send(ticketCreated);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.send(httpStatus.NOT_FOUND);
    }
  }
}
