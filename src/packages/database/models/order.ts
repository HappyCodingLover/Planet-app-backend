// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.orders`)
export class Orders extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('int4')
  public user_id: number

  @Column('int4')
  public status: number

  @Column('int4')
  public delivery_type: number

  @Column('varchar')
  public tracking: string

  @Column('varchar')
  public labelLink: string

  @Column('varchar')
  public shipmentNumber: string

  @Column('timestamp with time zone')
  public created_at: Timestamp

  @Column('timestamp with time zone')
  public updated_at: Timestamp
}
