import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateIdempotencyKeyTable1767184693049 implements MigrationInterface {
    name = 'CreateIdempotencyKeyTable1767184693049'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`idempotency_keys\` (\`id\` varchar(36) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`createdAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`key\` varchar(255) NOT NULL, \`requestPath\` varchar(255) NOT NULL, \`userId\` varchar(255) NOT NULL, \`response\` json NOT NULL, \`expiresAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, INDEX \`IDX_idempotency_key\` (\`key\`), UNIQUE INDEX \`IDX_0afd83cbf08c9d12089a9bffc5\` (\`key\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_0afd83cbf08c9d12089a9bffc5\` ON \`idempotency_keys\``);
        await queryRunner.query(`DROP INDEX \`IDX_idempotency_key\` ON \`idempotency_keys\``);
        await queryRunner.query(`DROP TABLE \`idempotency_keys\``);
    }

}
