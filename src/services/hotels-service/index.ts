import { Hotel, Room } from '@prisma/client';
import hotelsRepository from '@/repositories/hotels-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';

async function getHotels(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const hotels = await hotelsRepository.findHotels();

  return hotels;
}

async function getHotelRooms(userId: number, hotelId: number): Promise<Room[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const rooms = await hotelsRepository.findHotelRooms(hotelId);

  return rooms;
}

export default { getHotels, getHotelRooms };
