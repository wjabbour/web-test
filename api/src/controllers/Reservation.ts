import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { logger } from '../logger';
import { Reservation } from '../models/Reservation';

@Controller('reservation')
export class ReservationController {
  @Post('')
  private async post (req: Request, res: Response) {
    const startTime = Date.now();
    const reservation = req.body;
    const entry = Reservation.build({ ...reservation });

    try {
      await entry.save();
      logger.info({ path: 'reservation', method: 'post', duration: Date.now() - startTime });
      return res.sendStatus(200);
    } catch (e) {
      logger.error({ path: 'reservation', method: 'post', duration: Date.now() - startTime, error: e.message });
      return res.status(500).json({ error: e.message });
    }
  }
}
