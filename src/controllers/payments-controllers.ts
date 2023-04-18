import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import paymentsService from '@/services/payments-service';

export async function getPayment(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;
  const ticketId = req.query.ticketId as unknown as number;

  try {
    const payment = await paymentsService.getPayment(ticketId, userId);

    return res.status(httpStatus.OK).send(payment);
  } catch (error) {
    if (error.name === 'UnauthorizedError') {
      return res.send(httpStatus.UNAUTHORIZED);
    }
    if (error.name === 'InvalidDataError') {
      return res.send(httpStatus.BAD_REQUEST);
    }
    if (error.name === 'NotFoundError') {
      return res.send(httpStatus.NOT_FOUND);
    }
  }
}

export async function processPayment(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId as number;

  try {
    const paymentConfirmation = await paymentsService.processPayment({ ...req.body }, userId);

    return res.sendStatus(httpStatus.OK).send(paymentConfirmation);
  } catch (error) {
    if (error.name === 'InvalidDataError') {
      return res.send(httpStatus.BAD_REQUEST);
    }
    if (error.name === 'NotFoundError') {
      return res.send(httpStatus.NOT_FOUND);
    }
  }
}
