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
  const room = await bookingRepository.findHotelRooms(roomId);
  if (!room) throw notFoundError();

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === 'RESERVED' || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw ForbiddenError();
  }

  const bookingsRoom = await bookingRepository.getAllBookingsByRoom(roomId);

  if (bookingsRoom.length >= room.capacity) throw ForbiddenError();

  const booking = await bookingRepository.createBooking(userId, roomId);

  const objReturn = { bookingId: booking.id };

  return objReturn;
}

async function switchBooking(userId: number, roomId: number, bookingId: number) {
  const reservedBooking = await bookingRepository.getBookingById(bookingId);
  if (!reservedBooking || userId !== reservedBooking.userId) throw ForbiddenError();

  const room = await bookingRepository.findHotelRooms(roomId);
  if (!room) throw notFoundError();

  const bookingsRoom = await bookingRepository.getAllBookingsByRoom(roomId);
  if (bookingsRoom.length >= room.capacity) throw ForbiddenError();

  const booking = await bookingRepository.updateBooking(bookingId, roomId);

  const objReturn = { bookingId: booking.id };

  return objReturn;
}

const bookingService = {
  getUserBooking,
  createBooking,
  switchBooking,
};

export default bookingService;
