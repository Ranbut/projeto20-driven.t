import { Hotel, Room } from '@prisma/client';
import hotelsRepository from '@/repositories/hotels-repository';

async function getHotels(): Promise<Hotel[]> {
  const hotels = await hotelsRepository.findHotels();

  return hotels;
}

async function getHotelRooms(hotelId: number): Promise<Room[]> {
  const rooms = await hotelsRepository.findHotelRooms(hotelId);

  return rooms;
}

export default { getHotels, getHotelRooms };
