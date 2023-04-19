import { Hotel, Room } from '@prisma/client';
import { prisma } from '@/config';

async function findHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findHotelRooms(hotelId: number): Promise<Room[]> {
  return prisma.room.findMany({
    where: {
      hotelId,
    },
  });
}

export default { findHotels, findHotelRooms };
