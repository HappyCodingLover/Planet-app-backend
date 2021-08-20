import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { withTimestampsMigration } from '~/packages/database/helpers/withTimestampsMigration'
import config from '~/config'
const tableName = `${config.DB.MAIN_SCHEMA}.connectivite`

export class createConnectiviteTable1629339938060 implements MigrationInterface {
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
              name: 'bluetooth',
              type: 'bool',
            },
            {
              name: 'norme_bluetooth',
              type: 'varchar',
            },
            {
              name: 'wifi',
              type: 'bool',
            },
            {
              name: 'norme_wifi',
              type: 'varchar',
            },
            {
              name: 'dlna',
              type: 'bool',
            },
            {
              name: 'nfc',
              type: 'bool',
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
