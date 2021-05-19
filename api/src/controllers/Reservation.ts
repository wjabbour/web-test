import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Reservation } from '../models/Reservation';

@Controller('reservation')
export class ReservationController {
  @Post('')
  private async get(req: Request, res: Response) {
    const reservation = req.body;
    const entry = Reservation.build({ ...reservation });
    await entry.save();
    return res.sendStatus(200);
  }
}
