// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.order_status`)
export class OrderStatus extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('varchar')
  public name_fr: string

  @Column('timestamp with time zone')
  public created_at: Timestamp

  @Column('timestamp with time zone')
  public updated_at: Timestamp
}
