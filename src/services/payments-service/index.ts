import { invalidDataError, notFoundError, unauthorizedError } from '@/errors';
import { ProcessPaymentWithBody } from '@/protocols';
import paymentsRepository from '@/repositories/payments-repository';
import ticketsRepository from '@/repositories/tickets-repository';

async function getPayment(ticketId: number, userId: number) {
  if (!ticketId) throw invalidDataError(['Ticket ID not given']);

  const user = await ticketsRepository.findByID(userId);
  if (!user) throw unauthorizedError();

  const payment = await paymentsRepository.getUserPayment(ticketId);
  if (!payment) throw notFoundError();

  return payment;
}

async function processPayment(body: ProcessPaymentWithBody) {
  if (!body.cardData || !body.ticketId)
    throw invalidDataError(['Body data is incorrect. Verify if is', 'Incorrect ticketId', 'Incorrect cardData']);

  const payment = await paymentsRepository.getUserPayment(body.ticketId);
  if (!payment) throw notFoundError();

  const paymentProcess = await paymentsRepository.processUserPayment(body);

  return paymentProcess;
}

const paymentsService = {
  getPayment,
  processPayment,
};

export default paymentsService;
