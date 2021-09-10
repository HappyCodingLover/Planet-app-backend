// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.categories`)
export class Categories extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('varchar')
  public pid: number

  @Column('varchar')
  public name_fr: string

  @Column('varchar')
  public iconFamily: string

  @Column('varchar')
  public icon: string

  @Column('varchar')
  public backgroundColor: string

  @Column('varchar')
  public color: string

  @Column('bool')
  public active: boolean

  @Column('timestamp with time zone')
  public created_at: Timestamp

  @Column('timestamp with time zone')
  public updated_at: Timestamp
}
