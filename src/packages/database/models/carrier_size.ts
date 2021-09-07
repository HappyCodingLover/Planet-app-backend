// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.carrier_size`)
export class Carrier_size extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('varchar')
  public nom: string

  @Column('varchar')
  public size: string

  @Column('int4')
  public transporteur_id: number

  @Column('varchar')
  public description: string

  @Column('float4')
  public price: number
}
