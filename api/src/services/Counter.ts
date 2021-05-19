import { Op } from "sequelize/types";
import { Reservation } from "../models/Reservation";
import * as logger from '../logger/index';
import winston from "winston";


const hours = ['5', '6', '7', '8', '9'];
export const minutes = ['00', '15', '30', '45'];

export class Counter {

  private reservationCount;
  private logger: winston.Logger;
  constructor () {
    this.logger = logger.default;
    this.reservationCount = {};
    this.initializeCount();
  }

  async countReservations (date: any) {
    this.resetCount();
    const reservations = await Reservation.findAll({
      where: {
        date: {
          [Op.eq]: date,
        }
      },
      raw: true
    });
    
    this.logger.debug({ path: 'slots', method: 'get', reservations });

    reservations.forEach((reservation) => {
      this.reservationCount[reservation['time']]++;
    });

    this.logger.debug({ path: 'slots', method: 'get', reservationCount: this.reservationCount });
  }

  hasCapacity (key: string, capacity): boolean {
    return this.reservationCount[key] < capacity;
  }

  reserveCount (key: string, capacity): number {
    return capacity - this.reservationCount[key];
  }

  private resetCount () {
    Object.keys(this.reservationCount).forEach((k) => {
      this.reservationCount[k] = 0;
    });
  }

  private initializeCount () {
    hours.forEach((hour) => {
      minutes.forEach((minute) => {
        this.reservationCount[`${hour}:${minute}`] = 0;
      });
    });
  }
}