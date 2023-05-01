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

async function getAllBookingsByRoom(roomId: number): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: {
      roomId,
    },
  });
}

const bookingRepository = {
  getFirstUserBooking,
  findHotelRooms,
  createBooking,
  getAllBookingsByRoom,
};

export default bookingRepository;
