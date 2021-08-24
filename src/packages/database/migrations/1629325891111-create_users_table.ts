import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { withTimestampsMigration } from '~/packages/database/helpers/withTimestampsMigration'
import config from '~/config'
const tableName = `${config.DB.MAIN_SCHEMA}.users`

export class createUsersTable1629325891111 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table(
        withTimestampsMigration({
          columns: [
            {
              isGenerated: true,
              isPrimary: true,
              name: 'id',
              type: 'int4',
            },
            {
              name: 'users_type_id',
              type: 'int2',
              isNullable: true,
            },
            {
              name: 'name',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'firstname',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'password',
              type: 'varchar',
            },
            {
              name: 'level',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'email',
              type: 'varchar',
            },
            {
              name: 'email_valid',
              type: 'bool',
              default: false,
            },
            {
              name: 'description_fr',
              type: 'varchar',
              isNullable: true,
            },
            {
              name: 'cities_id',
              type: 'int2',
              isNullable: true,
            },
            {
              name: 'active',
              type: 'bool',
              default: false,
            },
          ],
          name: tableName,
        }),
      ),
    )
    await queryRunner.query(`select * from ${tableName}`)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(`${tableName}`)
  }
}
