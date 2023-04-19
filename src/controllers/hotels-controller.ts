import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import hotelsService from '@/services/hotels-service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  try {
    const hotels = await hotelsService.getHotels();

    return res.status(httpStatus.OK).send(hotels);
  } catch (error) {
    return res.sendStatus(httpStatus.NO_CONTENT);
  }
}

export async function getHotelRooms(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);

  try {
    const hotelRooms = await hotelsService.getHotelRooms(hotelId);
    res.status(httpStatus.OK).send(hotelRooms);
  } catch (error) {
    if (error.name === 'NotFoundError') {
      return res.send(httpStatus.NO_CONTENT);
    }
    if (error.name === 'PaymentError') {
      return res.send(httpStatus.PAYMENT_REQUIRED);
    }
    if (error.name === 'RequestError') {
      return res.send(httpStatus.BAD_REQUEST);
    }
  }
}
