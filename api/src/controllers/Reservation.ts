import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Reservation } from '../models/Reservation';
import winston from "winston";
import * as logger from '../logger/index';


@Controller('reservation')
export class ReservationController {

  private logger: winston.Logger;
  constructor () {
    this.logger = logger.default;
  }

  @Post('')
  private async post (req: Request, res: Response) {
    const startTime = Date.now();
    const reservation = req.body;
    const entry = Reservation.build({ ...reservation });

    try {
      await entry.save();
      this.logger.info({ path: 'reservation', method: 'post', duration: Date.now() - startTime });
      return res.sendStatus(200);
    } catch (e) {
      this.logger.error({ path: 'reservation', method: 'post', duration: Date.now() - startTime, error: e.message });
      return res.status(500).json({ error: e.message });
    }
  }
}
