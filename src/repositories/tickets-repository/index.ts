import { Enrollment, Ticket, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

async function findByID(userId: number) {
  return prisma.user.findMany({
    where: { id: userId },
  });
}

async function getAllTypes(): Promise<TicketType[]> {
  return prisma.ticketType.findMany();
}

async function getUserTicket(userId: number): Promise<Ticket & { Enrollment: Enrollment; TicketType: TicketType }> {
  return prisma.ticket.findFirst({
    where: { id: userId },
    include: {
      Enrollment: true,
      TicketType: true,
    },
  });
}

async function createUserTicket(
  ticketTypeId: number,
  enrollmentId: number,
  status: TicketStatus,
  ticketId: number,
): Promise<Ticket> {
  return prisma.ticket.upsert({
    where: { id: ticketId },
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
  getUserTicket,
  createUserTicket,
};

export default eventRepository;
