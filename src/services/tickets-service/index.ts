import { notFoundError } from '@/errors';
import ticketsRepository from '@/repositories/tickets-repository';
import enrollmentRepository from '@/repositories/enrollment-repository';
import { Ticket } from '@/protocols';

export async function getTicketsTypes() {
  const ticketTypes = await ticketsRepository.getAllTypes();
  if (!ticketTypes) throw notFoundError();

  return ticketTypes;
}

async function getAllUserTickets(userId: number) {
  const enrollmentExist = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentExist) throw notFoundError();

  const tickets = await ticketsRepository.getAllUserTickets(userId);
  if (tickets.length === 0) throw notFoundError();

  return tickets;
}

async function createNewTicket(userId: number, ticketTypeId: number) {
  const enrollmentExist = await enrollmentRepository.findWithAddressByUserId(userId);

  if (!enrollmentExist) throw notFoundError();

  const ticketCreated: Ticket = {
    id: 1,
    status: 'RESERVED', //RESERVED | PAID
    ticketTypeId: ticketTypeId,
    enrollmentId: 1,
    TicketType: {
      id: 1,
      name: 'Exemplo',
      price: 10000,
      isRemote: true,
      includesHotel: true,
      createdAt: 'Date',
      updatedAt: 'Date',
    },
    createdAt: 'Date',
    updatedAt: 'Date',
  };

  return ticketCreated;
}

const ticketService = {
  getTicketsTypes,
  getAllUserTickets,
  createNewTicket,
};

export default ticketService;
