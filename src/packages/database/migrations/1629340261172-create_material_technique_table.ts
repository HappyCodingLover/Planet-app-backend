import { MigrationInterface, QueryRunner, Table } from 'typeorm'
import { withTimestampsMigration } from '~/packages/database/helpers/withTimestampsMigration'
import config from '~/config'
const tableName = `${config.DB.MAIN_SCHEMA}.material_technique`

export class createMaterialTechniqueTable1629340261172 implements MigrationInterface {
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
              name: 'color_id',
              type: 'int4',
            },
            {
              name: 'width',
              type: 'varchar',
            },
            {
              name: 'height',
              type: 'bool',
            },
            {
              name: 'depth',
              type: 'varchar',
            },
            {
              name: 'weight',
              type: 'varchar',
            },
            {
              name: 'digital_touch',
              type: 'bool',
            },
            {
              name: 'digital_size',
              type: 'varchar',
            },
            {
              name: 'processor_id',
              type: 'int4',
            },
            {
              name: 'ram_id',
              type: 'int4',
            },
            {
              name: 'memory_id',
              type: 'int4',
            },
            {
              name: 'os_id',
              type: 'int4',
            },
            {
              name: 'das',
              type: 'varchar',
            },
            {
              name: 'type_sim_id',
              type: 'int4',
            },
            {
              name: 'double_sim',
              type: 'bool',
            },
            {
              name: 'virtual_sim',
              type: 'bool',
            },
            {
              name: 'SD',
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
