import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTransactionPinColumn1766622272977 implements MigrationInterface {
    name = 'RemoveTransactionPinColumn1766622272977'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` DROP COLUMN \`transactionPin\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`users\` ADD \`transactionPin\` varchar(255) NULL`);
    }

}
