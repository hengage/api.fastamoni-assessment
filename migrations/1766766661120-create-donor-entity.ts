import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDonorEntity1766766661120 implements MigrationInterface {
    name = 'CreateDonorEntity1766766661120'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`donations\` (\`id\` varchar(36) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`amount\` decimal(12,2) NOT NULL, \`transactionRef\` varchar(50) NOT NULL, \`status\` enum ('PENDING', 'SUCCESS', 'FAILED', 'REVERSED') NOT NULL DEFAULT 'SUCCESS', \`message\` varchar(255) NULL, \`donorId\` varchar(36) NULL, \`beneficiaryId\` varchar(36) NULL, \`donorWalletId\` varchar(36) NULL, \`beneficiaryWalletId\` varchar(36) NULL, UNIQUE INDEX \`IDX_051e387dd9653d8a25adf3964f\` (\`transactionRef\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`donations\` ADD CONSTRAINT \`FK_e3eebd26ba5ec476feb06c93cea\` FOREIGN KEY (\`donorId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`donations\` ADD CONSTRAINT \`FK_2eef9019bcbee68df010483c682\` FOREIGN KEY (\`beneficiaryId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`donations\` ADD CONSTRAINT \`FK_dd47d455478b4f63e35d9043fe3\` FOREIGN KEY (\`donorWalletId\`) REFERENCES \`wallets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`donations\` ADD CONSTRAINT \`FK_2f48bc9db0db081b7cb6b6e35fc\` FOREIGN KEY (\`beneficiaryWalletId\`) REFERENCES \`wallets\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`donations\` DROP FOREIGN KEY \`FK_2f48bc9db0db081b7cb6b6e35fc\``);
        await queryRunner.query(`ALTER TABLE \`donations\` DROP FOREIGN KEY \`FK_dd47d455478b4f63e35d9043fe3\``);
        await queryRunner.query(`ALTER TABLE \`donations\` DROP FOREIGN KEY \`FK_2eef9019bcbee68df010483c682\``);
        await queryRunner.query(`ALTER TABLE \`donations\` DROP FOREIGN KEY \`FK_e3eebd26ba5ec476feb06c93cea\``);
        await queryRunner.query(`DROP INDEX \`IDX_051e387dd9653d8a25adf3964f\` ON \`donations\``);
        await queryRunner.query(`DROP TABLE \`donations\``);
    }

}
