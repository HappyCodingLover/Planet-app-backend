// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.products`)
export class Products extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('varchar')
  public name_fr: string

  @Column('int4')
  public categoriesSubs_id: number

  @Column('int4')
  public price: number

  @Column('int4')
  public status_id: number

  @Column('bool')
  public active: boolean

  @Column('timestamp with time zone')
  public created_at: Timestamp

  @Column('timestamp with time zone')
  public updated_at: Timestamp
}
