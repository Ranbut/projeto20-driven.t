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
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function processPayment(req: AuthenticatedRequest, res: Response) {
  try {
    const paymentConfirmation = await paymentsService.processPayment({ ...req.body });

    return res.sendStatus(httpStatus.OK).send(paymentConfirmation);
  } catch (error) {
    return res.sendStatus(httpStatus.BAD_REQUEST);
  }
}
