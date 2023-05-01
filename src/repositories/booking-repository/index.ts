import { Booking, Room, User } from '@prisma/client';
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

async function updateBooking(userId: number, id: number): Promise<Booking> {
  return prisma.booking.update({
    where: {
      id,
    },
    data: {
      userId,
    },
  });
}

async function getFirstBooking(bookingId: number): Promise<Booking & { User: User }> {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: { User: true },
  });
}

const bookingRepository = {
  getFirstUserBooking,
  findHotelRooms,
  createBooking,
  getAllBookingsByRoom,
  updateBooking,
  getFirstBooking,
};

export default bookingRepository;
