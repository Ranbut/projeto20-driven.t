import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function findHotels(): Promise<Hotel[]> {
  return prisma.hotel.findMany();
}

async function findHotelRooms(hotelId: number): Promise<Hotel[]> {
  return prisma.hotel.findMany({
    where: {
      id: hotelId,
    },
  });
}

export default { findHotels, findHotelRooms };
