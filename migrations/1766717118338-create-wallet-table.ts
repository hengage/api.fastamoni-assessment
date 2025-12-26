import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateWalletTable1766717118338 implements MigrationInterface {
    name = 'CreateWalletTable1766717118338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`wallets\` (\`id\` varchar(36) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`balance\` decimal(12,2) NOT NULL DEFAULT '0.00', \`transactionPin\` varchar(255) NULL, \`userId\` varchar(36) NULL, UNIQUE INDEX \`REL_2ecdb33f23e9a6fc392025c0b9\` (\`userId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`wallets\` ADD CONSTRAINT \`FK_2ecdb33f23e9a6fc392025c0b97\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`wallets\` DROP FOREIGN KEY \`FK_2ecdb33f23e9a6fc392025c0b97\``);
        await queryRunner.query(`DROP INDEX \`REL_2ecdb33f23e9a6fc392025c0b9\` ON \`wallets\``);
        await queryRunner.query(`DROP TABLE \`wallets\``);
    }

}
