import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Inventory } from '../models/Inventory';
import * as logger from '../logger/index';
import { Counter, minutes } from '../services/Counter';
import winston from "winston";

@Controller('inventory')
export class InventoryController {

  private counter: Counter;
  private logger: winston.Logger;
  constructor () {
    this.counter = new Counter();
    this.logger = logger.default;
  }

  @Post('')
  private async post (req: Request, res: Response) {
    const startTime = Date.now();
    const inventory = req.body;
    const entry = Inventory.build({ ...inventory });

    try {
      await entry.save();
      this.logger.info({ path: 'inventory', method: 'post', duration: Date.now() - startTime });
      return res.sendStatus(200);
    } catch (e) {
      this.logger.error({ path: 'inventory', method: 'post', duration: Date.now() - startTime, error: e.message });
      return res.status(500).json({ error: e.message });
    }
  }

  @Get('')
  private async get (req: Request, res: Response) {
    const startTime = Date.now();

    try {
      const inventory = await Inventory.findAll({ raw: true });
      await this.counter.countReservations(req.query.date);

      // holds information about each inventory as well as the reserve capacities
      const inventoryData = [];

      inventory.forEach((inv) => {
        const slots = this.determineReserveCapacity(inv.start, inv.end, inv.capacity);

        inventoryData.push({
          start: inv.start,
          end: inv.end,
          capacity: inv.capacity,
          reserveCapacities: slots
        });
      });

      this.logger.info({ path: 'inventory', method: 'get', duration: Date.now() - startTime });
      return res.status(200).json(inventoryData);
    } catch (e) {
      this.logger.error({ path: 'inventory', method: 'post', duration: Date.now() - startTime, error: e.message });
      return res.status(500).json({ error: e.message });
    }
  }

  // tells us how many spots we have open for reservations per 15 minute interval
  private determineReserveCapacity (start: string, end: string, capacity: number): string[] {
    const reserveCounts = [];

    for (let i = parseInt(start[0]); i < parseInt(end[0]); i++) {
      minutes.forEach((minute) => {
        reserveCounts.push({
          time: `${i}:${minute}`,
          reserveCapacity: this.counter.reserveCount(`${i}:${minute}`, capacity)
        })
      });
    }

    this.logger.debug({ path: 'slots', method: 'get', start, end, capacity, reserveCounts });
    return reserveCounts;
  }
}