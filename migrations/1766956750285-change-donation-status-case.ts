import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeDonationStatusCase1766956750285 implements MigrationInterface {
    name = 'ChangeDonationStatusCase1766956750285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`donations\` CHANGE \`status\` \`status\` enum ('pending', 'success', 'failed', 'reversed') NOT NULL DEFAULT 'success'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`donations\` CHANGE \`status\` \`status\` enum ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED') NOT NULL DEFAULT 'SUCCESS'`);
    }

}
