// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.product_images`)
export class ProductImages extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('int4')
  public product_id: number

  @Column('varchar')
  public name: string

  @Column('varchar')
  public url: string

  @Column('timestamp with time zone')
  public created_at: Timestamp

  @Column('timestamp with time zone')
  public updated_at: Timestamp
}
