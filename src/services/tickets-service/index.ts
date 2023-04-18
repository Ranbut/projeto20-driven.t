import { Ticket, TicketType } from '@prisma/client';
import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';

export async function getTicketsTypes(): Promise<TicketType[]> {
  const ticketTypes = await ticketsRepository.getAllTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function getAllUserTickets(userId: number): Promise<Ticket[]> {
  const tickets = await ticketsRepository.getAllUserTickets(userId);

  return tickets;
}

async function createNewTicket(userId: number, ticketTypeId: number): Promise<Ticket> {
  const enrollmentExist = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentExist) throw notFoundError();

  const ticketCreated = ticketsRepository.createUserTicket(ticketTypeId, enrollmentExist.id, 'RESERVED');

  return ticketCreated;
}

const ticketService = {
  getTicketsTypes,
  getAllUserTickets,
  createNewTicket,
};

export default ticketService;
