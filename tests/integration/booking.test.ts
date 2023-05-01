import httpStatus from 'http-status';
import supertest from 'supertest';
import { TicketStatus } from '@prisma/client';
import faker from '@faker-js/faker';
import { cleanDb, generateValidToken } from '../helpers';
import {
  createEnrollmentWithAddress,
  createPayment,
  createTicket,
  createTicketTypeHotel,
  createUser,
  createHotel,
  createRoom,
  createBooking,
  createTicketTypeRemote,
  createTicketType,
} from '../factories';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
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

    it('should respond with status 404 when user do not have the booking', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      await createRoom(createdHotel.id);

      const response = await server.get(`/booking`).set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 with roomId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      const response = await server
        .post(`/booking`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRoom.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: expect.any(Number) });
    });

    it('should respond with status 403 with remote ticket', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      await createTicketTypeRemote();

      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      const response = await server
        .post(`/booking`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if ticket does not include hotel', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
      await createTicketType();

      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      const response = await server
        .post(`/booking`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 if ticket is not paid', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      const response = await server
        .post(`/booking`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 404 if room does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

      await createHotel();

      const response = await server.post(`/booking`).set('Authorization', `Bearer ${token}`).send({ roomId: 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when room is at full capacity', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      for (let i = 0; i < createdRoom.capacity; i++) {
        await createBooking(user.id, createdRoom.id);
      }

      const response = await server
        .post(`/booking`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
  });
});

describe('PUT /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.post('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when token is valid', () => {
    it('should respond with status 200 with roomId', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      const createdRoomFirst = await createRoom(createdHotel.id);
      const createdRoomSecond = await createRoom(createdHotel.id);

      const createdBooking = await createBooking(user.id, createdRoomFirst.id);

      console.log(createdBooking.roomId);

      const response = await server
        .put(`/booking/${createdBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRoomSecond.id });

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({ bookingId: expect.any(Number) });
    });

    it('should respond with status 404 if room does not exist', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);
      const createdBooking = await createBooking(user.id, createdRoom.id);

      const response = await server
        .put(`/booking/${createdBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: 1 });

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it('should respond with status 403 when user do not have booking', async () => {
      const userFirst = await createUser();
      const userSecond = await createUser();
      const token = await generateValidToken(userFirst);
      const enrollment = await createEnrollmentWithAddress(userFirst);
      const ticketType = await createTicketTypeHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);
      const createdBooking = await createBooking(userSecond.id, createdRoom.id);

      const response = await server
        .put(`/booking/${createdBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });

    it('should respond with status 403 when room is at full capacity', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketTypeHotel();
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const createdHotel = await createHotel();
      const createdRoom = await createRoom(createdHotel.id);

      for (let i = 0; i < createdRoom.capacity; i++) {
        await createBooking(user.id, createdRoom.id);
      }

      const createdBooking = await createBooking(user.id, createdRoom.id);

      const response = await server
        .put(`/booking/${createdBooking.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ roomId: createdRoom.id });

      expect(response.status).toBe(httpStatus.FORBIDDEN);
    });
  });
});
