import {
  Column,
  CreatedAt,
  DeletedAt,
  Model,
  PrimaryKey, Table,
  UpdatedAt
} from 'sequelize-typescript'

@Table({ tableName: 'inventories' })
export class Inventory extends Model<Inventory> {
  @PrimaryKey
  @Column({ autoIncrement: true })
  id: number

  @Column
  start: string

  @Column
  end: string

  @Column
  capacity: string

  @DeletedAt
  deleted_at: string

  @CreatedAt
  created_at: string

  @UpdatedAt
  updated_at: string
}
