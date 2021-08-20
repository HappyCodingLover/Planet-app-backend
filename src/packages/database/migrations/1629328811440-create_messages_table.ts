import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { withTimestampsMigration } from '~/packages/database/helpers/withTimestampsMigration'
import config from '~/config'
const tableName = `${config.DB.MAIN_SCHEMA}.messages`
export class createMessagesTable1629328811440 implements MigrationInterface {
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
              name: 'product_id',
              type: 'int4',
            },
            {
              name: 'fromUserId',
              type: 'int4',
            },
            {
              name: 'toUserId',
              type: 'int4',
            },
            {
              name: 'content',
              type: 'text',
            },
            {
              name: 'offer_price',
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
