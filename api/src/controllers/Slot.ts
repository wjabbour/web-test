import { Controller, Get } from '@overnightjs/core'
import { Request, Response } from 'express'
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
  private async get(req: Request, res: Response) {
    this.resetCount();
    let availableSlots: string[] = [];
    const reservations = await Reservation.findAll({
      where: {
        date: {
          [Op.eq]: req.query.date,
        }
      },
      raw: true
    });

    this.countReservations(reservations);

    const inventory = await Inventory.findAll({ raw: true });
    inventory.forEach((inv) => {
      const slots = this.determineSlots(inv.start, inv.end, inv.capacity);
      availableSlots = availableSlots.concat(slots);
    });

    return res.status(200).json(availableSlots);
  }

  private determineSlots (start: string, end: string, capacity: number): string[] {
    const availableSlots = [];
    for (let i = parseInt(start[0]); i < parseInt(end[0]); i++) {
      minutes.forEach((minute) => {
        if (reservationCount[`${i}:${minute}`] < capacity) availableSlots.push(`${i}:${minute}`);
      });
    }
    return availableSlots;
  }

  private async countReservations (reservations: []) {
    reservations.forEach((reservation) => {
      reservationCount[reservation['time']]++;
    });
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