import { Booking } from '@prisma/client';
import { prisma } from '@/config';

async function getFirstUserBooking(userId: number): Promise<Booking> {
  return prisma.booking.findFirst({
    where: { userId },
    include: { Room: true },
  });
}

const bookingRepository = {
  getFirstUserBooking,
};

export default bookingRepository;
