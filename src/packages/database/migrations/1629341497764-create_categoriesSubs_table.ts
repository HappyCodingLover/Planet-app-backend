import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { withTimestampsMigration } from '~/packages/database/helpers/withTimestampsMigration'
import config from '~/config'
const tableName = `${config.DB.MAIN_SCHEMA}.categories_subs`
export class createCategoriesSubsTable1629341497764 implements MigrationInterface {
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
              name: 'categories_id',
              type: 'int4',
            },
            {
              name: 'name_fr',
              type: 'varchar',
            },
            {
              name: 'iconFamily',
              type: 'varchar',
            },
            {
              name: 'icon',
              type: 'varchar',
            },
            {
              name: 'backgroundColor',
              type: 'varchar',
            },
            {
              name: 'color',
              type: 'varchar',
            },
            {
              name: 'active',
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
