import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import bookingService from '@/services/booking-service';

export async function getUserBooking(req: AuthenticatedRequest, res: Response) {
  try {
    const { userId } = req;

    const booking = await bookingService.getUserBooking(userId);

    return res.status(httpStatus.OK).send(booking);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

/*export async function createBooking(req: AuthenticatedRequest, res: Response) {
  try {

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}*/

/*export async function switchBooking(req: AuthenticatedRequest, res: Response) {

  try {

    return res.sendStatus(httpStatus.OK);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}*/
