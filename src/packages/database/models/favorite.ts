// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.favorite_product`)
export class Favorite extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('int4')
  public id_users: number

  @Column('int4')
  public id_product: number

  @Column('bool')
  public active: boolean

  @Column('timestamp with time zone')
  public created_at: Timestamp

  @Column('timestamp with time zone')
  public updated_at: Timestamp
}
