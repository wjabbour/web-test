import { Controller, Get, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Inventory } from '../models/Inventory';

@Controller('inventory')
export class InventoryController {
  @Post('')
  private async post(req: Request, res: Response) {
    const inventory = req.body;
    const entry = Inventory.build({ ...inventory });
    await entry.save();
    return res.sendStatus(200);
  }

  @Get('')
  private async get(req: Request, res: Response) {
    let inventory = await Inventory.findAll();
    inventory = inventory.map((inventory) => inventory.toJSON());
    return res.status(200).json(inventory);
  }
}