import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { withTimestampsMigration } from '~/packages/database/helpers/withTimestampsMigration'
import config from '~/config'
const tableName = `${config.DB.MAIN_SCHEMA}.type_sim`

export class createTypeSimTable1629340817931 implements MigrationInterface {
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
              name: 'type_sim',
              type: 'varchar',
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
