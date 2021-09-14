// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.messages`)
export class Messages extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('int4')
  public product_id: string

  @Column('int4')
  public fromUserId: number

  @Column('int4')
  public toUserId: number

  @Column('varchar')
  public content: number

  @Column('varchar')
  public offer_price: number

  @Column('bool')
  public active: boolean

  @Column('timestamp with time zone')
  public created_at: Timestamp

  @Column('timestamp with time zone')
  public updated_at: Timestamp
}
