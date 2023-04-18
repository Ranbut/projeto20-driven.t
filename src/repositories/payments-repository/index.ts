import { prisma } from '@/config';
import { ProcessPaymentWithBody } from '@/protocols';

async function getUserPayment(ticketId: number) {
  return prisma.payment.findFirst({
    where: {
      ticketId: ticketId,
    },
  });
}

async function processUserPayment(data: ProcessPaymentWithBody) {
  return prisma.payment.create({
    data: {
      ticketId: data.ticketId,
      value: data.ticketId,
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
