import { TicketStatus } from '@prisma/client';
import { prisma } from '@/config';

async function findByID(userId: number) {
  return prisma.user.findMany({
    where: { id: userId },
  });
}

async function getAllTypes() {
  return prisma.ticketType.findMany();
}

async function getAllUserTickets(userId: number) {
  return prisma.ticket.findMany({
    where: { id: userId },
  });
}

async function createUserTicket(ticketTypeId: number, enrollmentId: number, status: TicketStatus) {
  return prisma.ticket.upsert({
    where: { id: 0 },
    create: {
      ticketTypeId,
      enrollmentId,
      status,
    },
    update: { status },
    include: { TicketType: true },
  });
}

const eventRepository = {
  findByID,
  getAllTypes,
  getAllUserTickets,
  createUserTicket,
};

export default eventRepository;
