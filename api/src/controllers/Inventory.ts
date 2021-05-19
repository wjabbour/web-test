import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'
import { Inventory } from '../models/Inventory';

@Controller('inventory')
export class InventoryController {
  @Post('')
  private async post(req: Request, res: Response) {
    const inventory = req.body;
    const entry = Inventory.build({ ...inventory });

    console.log(entry);
    await entry.save();
    return res.sendStatus(200);
  }
}