import { Enrollment, Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getTicketsTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketsRepository.getAllTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function getUserTicket(userId: number): Promise<Ticket & { Enrollment: Enrollment; TicketType: TicketType }> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const tickets = await ticketsRepository.getUserTicket(enrollment.id);
  if (!tickets) throw notFoundError();

  return tickets;
}

async function createNewTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const enrollmentExist = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentExist) throw notFoundError();

  const ticketCreated = ticketsRepository.createUserTicket(ticketTypeId, enrollmentExist.id, 'RESERVED', 0);

  return ticketCreated;
}

const ticketService = {
  getTicketsTypes,
  getUserTicket,
  createNewTicket,
};

export default ticketService;
