import { Hotel, Room } from '@prisma/client';
import hotelsRepository from '@/repositories/hotels-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError, paymentError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID') throw paymentError();

  const ticketType = await ticketsRepository.findTickeWithTypeById(ticket.id);
  if (ticketType.TicketType.isRemote) throw paymentError();

  const hotels = await hotelsRepository.findHotels();
  if (hotels.length === 0) throw notFoundError();

  return hotels;
}

async function getHotelRooms(userId: number, hotelId: number): Promise<Room[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  if (ticket.status !== 'PAID') throw paymentError();

  const ticketType = await ticketsRepository.findTickeWithTypeById(ticket.id);
  if (ticketType.TicketType.isRemote) throw paymentError();

  const rooms = await hotelsRepository.findHotelRooms(hotelId);
  if (rooms.length === 0) throw notFoundError();

  return rooms;
}

export default { getHotels, getHotelRooms };