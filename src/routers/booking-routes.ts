import { Router } from 'express';
import { authenticateToken, validateBody } from '@/middlewares';
import { createBooking, getUserBooking, switchBooking } from '@/controllers';
import { bookingSchema } from '@/schemas';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getUserBooking)
  .post('/', validateBody(bookingSchema), createBooking)
  .put('/:bookingId', switchBooking);

export { bookingRouter };
