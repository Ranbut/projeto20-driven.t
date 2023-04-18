import { Payment } from '@prisma/client';
import { prisma } from '@/config';
import { ProcessPaymentWithBody } from '@/protocols';

async function getUserPayment(ticketId: number): Promise<Payment> {
  return prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
}

async function processUserPayment(data: ProcessPaymentWithBody, value: number): Promise<Payment> {
  return prisma.payment.create({
    data: {
      ticketId: data.ticketId,
      value: value,
      cardIssuer: data.cardData.issuer,
      cardLastDigits: data.cardData.cvv as unknown as string,
    },
  });
}

const eventRepository = {
  getUserPayment,
  processUserPayment,
};

export default eventRepository;
