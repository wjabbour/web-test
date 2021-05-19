import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Inventory } from '../models/Inventory';
import { logger } from '../logger/index';

@Controller('inventory')
export class InventoryController {
  @Post('')
  private async post (req: Request, res: Response) {
    const startTime = Date.now();
    const inventory = req.body;
    const entry = Inventory.build({ ...inventory });

    try {
      await entry.save();
      logger.info({ path: 'inventory', method: 'post', duration: Date.now() - startTime });
      return res.sendStatus(200);
    } catch (e) {
      logger.error({ path: 'inventory', method: 'post', duration: Date.now() - startTime, error: e.message });
      return res.status(500).json({ error: e.message });
    }
  }

  @Get('')
  private async get (req: Request, res: Response) {
    const startTime = Date.now();

    try {
      let inventory = await Inventory.findAll();
      inventory = inventory.map((inventory) => inventory.toJSON());
      logger.info({ path: 'inventory', method: 'get', duration: Date.now() - startTime });
      return res.status(200).json(inventory);
    } catch (e) {
      logger.error({ path: 'inventory', method: 'post', duration: Date.now() - startTime, error: e.message });
      return res.status(500).json({ error: e.message });
    }
  }
}