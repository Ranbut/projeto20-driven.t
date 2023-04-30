import { Booking, Room } from '@prisma/client';
import { prisma } from '@/config';

async function getFirstUserBooking(userId: number): Promise<Booking> {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true },
  });
}

async function findHotelRooms(roomId: number): Promise<Room> {
  return prisma.room.findUnique({
    where: {
      id: roomId,
    },
  });
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });
}

const bookingRepository = {
  getFirstUserBooking,
  findHotelRooms,
  createBooking,
};

export default bookingRepository;
