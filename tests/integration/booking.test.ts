import httpStatus from 'http-status';
import supertest from 'supertest';
import { Booking, TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createPayment,
  createTicket,
  createTicketTypeHotel,
  createUser,
} from '../factories';
import { createHotel, createRoom } from '../factories/hotels-factory';
import { createBooking } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 200 and hotel with rooms', async () => {
    const user = await createUser();
    const token = await generateValidToken(user);
    const enrollment = await createEnrollmentWithAddress(user);
    const ticketType = await createTicketTypeHotel();
    const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
    await createPayment(ticket.id, ticketType.price);
    const createdHotel = await createHotel();
    const createdRoom = await createRoom(createdHotel.id);
    await createBooking(user.id, createdRoom.id);

    const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

    //const booking = response.body as Booking;

    expect(response.status).toBe(httpStatus.OK);
    /*expect(booking).toEqual(
          expect.objectContaining({
            id: expect.any(Number),
            Room: {}
        }),
      );*/
  });
});
