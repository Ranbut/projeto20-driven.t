import { Payment } from '@prisma/client';
import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { ProcessPaymentWithBody } from '@/protocols';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPayment(ticketId: number, userId: number): Promise<Payment> {
  if (!ticketId) throw invalidDataError(['Ticket ID not given']);

  const ticket = await ticketsRepository.getUserTicket(userId);
  if (!ticket) throw notFoundError();

  if (userId !== ticket.enrollmentId) throw unauthorizedError();

  const payment = await paymentsRepository.getUserPayment(ticketId);
  if (!payment) throw notFoundError();

  return payment;
}

async function processPayment(body: ProcessPaymentWithBody, userId: number): Promise<Payment> {
  if (!body.cardData || !body.ticketId)
    throw invalidDataError(['Body data is incorrect. Verify if is', 'Incorrect ticketId', 'Incorrect cardData']);

  const ticket = await ticketsRepository.getUserTicket(userId);
  if (!ticket) throw notFoundError();

  if (userId !== ticket.enrollmentId) throw unauthorizedError();

  const paymentProcess = await paymentsRepository.processUserPayment(body, ticket.TicketType.price);

  await ticketsRepository.createUserTicket(ticket.ticketTypeId, ticket.enrollmentId, 'PAID', ticket.id);

  return paymentProcess;
}

const paymentsService = {
  getPayment,
  processPayment,
};

export default paymentsService;
