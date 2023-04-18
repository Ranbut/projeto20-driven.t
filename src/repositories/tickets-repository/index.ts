import { Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findByID(userId: number) {
  return prisma.user.findMany({
    where: { id: userId },
  });
}

async function getAllTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function getAllUserTickets(userId: number): Promise<Ticket[]> {
  return prisma.ticket.findMany({
    where: { id: userId },
  });
}

async function createUserTicket(ticketTypeId: number, enrollmentId: number, status: TicketStatus): Promise<Ticket> {
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
