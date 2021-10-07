// tslint:disable:variable-name
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn, Timestamp, BeforeInsert } from 'typeorm'
import config from '~/config'

@Entity(`${config.DB.MAIN_SCHEMA}.users`)
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id: number

  @Column('int4')
  public users_type_id: number

  @Column('varchar')
  public name: string

  @Column('varchar')
  public firstname: string

  @Column('varchar')
  public username: string

  @Column('varchar')
  public email: string

  @Column('varchar')
  public password: string

  @Column('varchar')
  public level: string

  @Column('bool')
  public email_valid: boolean

  @Column('varchar')
  public description_fr: string

  @Column('int4')
  public cities_id: number

  @Column('varchar')
  public avatar: string

  @Column('bool')
  public active: boolean

  @Column('varchar')
  public address1: string

  @Column('varchar')
  public address2: string

  @Column('varchar')
  public postcode: string
  
  @Column('timestamp with time zone')
  public created_at: Timestamp

  @Column('timestamp with time zone')
  public updated_at: Timestamp
}
