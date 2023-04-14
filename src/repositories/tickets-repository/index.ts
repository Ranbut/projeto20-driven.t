import { prisma } from '@/config';

async function findByID(userId: number) {
  return prisma.user.findMany({
    where: {
      id: userId,
    },
  });
}

async function getAllTypes() {
  return prisma.ticketType.findMany();
}

async function getAllUserTickets(userId: number) {
  return prisma.ticket.findMany({
    where: {
      id: userId,
    },
  });
}

const eventRepository = {
  findByID,
  getAllTypes,
  getAllUserTickets,
};

export default eventRepository;
