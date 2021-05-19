import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Inventory } from '../models/Inventory';
import { Counter, minutes } from '../services/Counter';
import winston from "winston";
import * as logger from '../logger/index';


/*
  This controller is responsible for returning the eligible
  time slots that a user can choose from.
*/
@Controller('slots')
export class SlotController {

  private counter: Counter;
  private logger: winston.Logger;

  constructor () {
    this.counter = new Counter();
    this.logger = logger.default;
  }

  @Get('')
  private async get (req: Request, res: Response) {
    const startTime = Date.now();
    let availableSlots: string[] = [];

    /*
      Count reservations per time slot
      Return time slots whose reservation count is less than capacity
    */  
    try {
      this.logger.debug({ path: 'slots', method: 'get', incomingDate: req.query.date });

      this.counter.countReservations(req.query.date);
      const inventory = await Inventory.findAll({ raw: true });

      this.logger.debug({ path: 'slots', method: 'get', inventory });

      inventory.forEach((inv) => {
        const slots = this.determineSlots(inv.start, inv.end, inv.capacity);
        availableSlots = availableSlots.concat(slots);
      });
  
      this.logger.debug({ path: 'slots', method: 'get', availableSlots });
      this.logger.info({ path: 'slots', method: 'get', duration: Date.now() - startTime });

      return res.status(200).json(availableSlots);
    } catch (e) {
      this.logger.error({ path: 'slots', method: 'get', duration: Date.now() - startTime, error: e.message });
      return res.status(500).json({ error: e.message });
    }
  }

  private determineSlots (start: string, end: string, capacity: number): string[] {
    const availableSlots = [];

    for (let i = parseInt(start[0]); i < parseInt(end[0]); i++) {
      minutes.forEach((minute) => {
        if (this.counter.hasCapacity(`${i}:${minute}`, capacity)) availableSlots.push(`${i}:${minute}`)
      });
    }

    this.logger.debug({ path: 'slots', method: 'get', start, end, capacity, availableSlots });
    return availableSlots;
  }
}