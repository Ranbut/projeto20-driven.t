import { Booking } from '@prisma/client';
import bookingRepository from '@/repositories/booking-repository';
import { ForbiddenError, notFoundError } from '@/errors';
import enrollmentRepository from '@/repositories/enrollment-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getUserBooking(userId: number): Promise<Booking> {
  const booking = await bookingRepository.getFirstUserBooking(userId);
  if (!booking) throw notFoundError();

  return booking;
}

async function createBooking(userId: number, roomId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw ForbiddenError();
  }
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw ForbiddenError();
  }

  const booking = await bookingRepository.createBooking(userId, roomId);

  const room = await bookingRepository.findHotelRooms(roomId);
  if (!room) throw notFoundError();

  const objReturn = { bookingId: booking.id };

  console.log(objReturn);

  return objReturn;
}

/*async function switchBooking() {

}*/

const bookingService = {
  getUserBooking,
  createBooking,
  //switchBooking,
};

export default bookingService;
