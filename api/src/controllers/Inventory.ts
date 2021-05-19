import { Controller, Post } from '@overnightjs/core'
import { Request, Response } from 'express'

@Controller('inventory')
export class InventoryController {
  @Post('')
  private async get(req: Request, res: Response) {
    // create a new reservation in the database
    return res.send({ some: 'json' })
  }
}
