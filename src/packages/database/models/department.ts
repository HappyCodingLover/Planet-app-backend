// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.departments`)
export class Departments extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('varchar')
  public region_code: string

  @Column('varchar')
  public code: string

  @Column('varchar')
  public name: string

  @Column('varchar')
  public slug: string
}
