// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.cities`)
export class Cities extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('varchar')
  public department_code: string

  @Column('varchar')
  public insee_code: string

  @Column('varchar')
  public zip_code: string

  @Column('varchar')
  public name: string

  @Column('varchar')
  public slug: string

  @Column('float8')
  public gps_lat: number

  @Column('float8')
  public gps_lng: number

}
