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
    where: { id: roomId },
  });
}

async function createBooking(userId: number, roomId: number): Promise<Booking> {
  return prisma.booking.create({
    data: { userId, roomId },
  });
}

async function getBookingById(bookingId: number) {
  return await prisma.booking.findFirst({
    where: { id: bookingId },
  });
}

async function getAllBookingsByRoom(roomId: number): Promise<Booking[]> {
  return prisma.booking.findMany({
    where: { roomId },
  });
}

async function updateBooking(bookingId: number, roomId: number): Promise<Booking> {
  return prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
  });
}

async function getFirstBooking(bookingId: number): Promise<Booking> {
  return prisma.booking.findUnique({
    where: { id: bookingId },
    include: { Room: true },
  });
}

const bookingRepository = {
  getFirstUserBooking,
  findHotelRooms,
  createBooking,
  getBookingById,
  getAllBookingsByRoom,
  updateBooking,
  getFirstBooking,
};

export default bookingRepository;
