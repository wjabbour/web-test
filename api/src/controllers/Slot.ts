import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'
import { logger } from '../logger';
import { Inventory } from '../models/Inventory';
import { Reservation } from '../models/Reservation';
const { Op } = require("sequelize");

const reservationCount = {};
const hours = ['5', '6', '7', '8', '9'];
const minutes = ['00', '15', '30', '45'];

/*
  This controller is responsible for returning the eligible
  time slots that a user can choose from.
*/
@Controller('slots')
export class SlotController {

  constructor () {
    this.initializeCount();
  }

  @Get('')
  private async get (req: Request, res: Response) {
    const startTime = Date.now();
    this.resetCount();
    let availableSlots: string[] = [];

    /*
      Count reservations per time slot
      Return time slots whose reservation count is less than capacity
    */  
    try {
      logger.debug({ path: 'slots', method: 'get', incomingDate: req.query.date });

      const reservations = await Reservation.findAll({
        where: {
          date: {
            [Op.eq]: req.query.date,
          }
        },
        raw: true
      });

      logger.debug({ path: 'slots', method: 'get', reservations });

      this.countReservations(reservations);
      const inventory = await Inventory.findAll({ raw: true });

      logger.debug({ path: 'slots', method: 'get', inventory });

      inventory.forEach((inv) => {
        const slots = this.determineSlots(inv.start, inv.end, inv.capacity);
        availableSlots = availableSlots.concat(slots);
      });
  
      logger.debug({ path: 'slots', method: 'get', availableSlots });
      logger.info({ path: 'slots', method: 'get', duration: Date.now() - startTime });

      return res.status(200).json(availableSlots);
    } catch (e) {
      logger.error({ path: 'slots', method: 'get', duration: Date.now() - startTime, error: e.message });
      return res.status(500).json({ error: e.message });
    }
  }

  private determineSlots (start: string, end: string, capacity: number): string[] {
    const availableSlots = [];

    for (let i = parseInt(start[0]); i < parseInt(end[0]); i++) {
      minutes.forEach((minute) => {
        if (reservationCount[`${i}:${minute}`] < capacity) availableSlots.push(`${i}:${minute}`);
      });
    }

    logger.debug({ path: 'slots', method: 'get', start, end, capacity, availableSlots });
    return availableSlots;
  }

  private async countReservations (reservations: []) {
    reservations.forEach((reservation) => {
      reservationCount[reservation['time']]++;
    });

    logger.debug({ path: 'slots', method: 'get', reservationCount });
  }

  private resetCount () {
    Object.keys(reservationCount).forEach((k) => {
      reservationCount[k] = 0;
    });
  }

  private initializeCount () {
    hours.forEach((hour) => {
      minutes.forEach((minute) => {
        reservationCount[`${hour}:${minute}`] = 0;
      });
    });
  }
}