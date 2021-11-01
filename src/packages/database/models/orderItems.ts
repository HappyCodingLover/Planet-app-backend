// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.order_items`)
export class OrderItems extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('int4')
  public order_id: number

  @Column('int4')
  public product_id: number

  @Column('int4')
  public quantity: number

  @Column('int4')
  public product_price: number

  @Column('timestamp with time zone')
  public created_at: Timestamp

  @Column('timestamp with time zone')
  public updated_at: Timestamp
}
