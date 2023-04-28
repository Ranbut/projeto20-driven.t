import { Booking } from '@prisma/client';
import bookingRepository from '@/repositories/booking-repository';
import { notFoundError } from '@/errors';

async function getUserBooking(userId: number): Promise<Booking> {
  const booking = bookingRepository.getFirstUserBooking(userId);

  return booking;
}

/*async function createBooking() {

}

async function switchBooking() {

}*/

const bookingService = {
  getUserBooking,
  //createBooking,
  //switchBooking,
};

export default bookingService;
