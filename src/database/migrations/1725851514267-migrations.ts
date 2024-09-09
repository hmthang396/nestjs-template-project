import { MigrationInterface, QueryRunner } from "typeorm";

export class Migrations1725851514267 implements MigrationInterface {
    name = 'Migrations1725851514267'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`notification\` (\`id\` bigint NOT NULL AUTO_INCREMENT, \`uuid\` varchar(36) NOT NULL, \`is_sent\` tinyint NOT NULL DEFAULT 0, \`is_handle\` tinyint NOT NULL DEFAULT 0, \`is_error\` tinyint NOT NULL DEFAULT 0, \`exchange\` varchar(32) NOT NULL DEFAULT '', \`routing_key\` varchar(32) NOT NULL DEFAULT '', \`payload\` text NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`otps\` (\`id\` int NOT NULL AUTO_INCREMENT, \`user_account_id\` bigint NOT NULL, \`code\` varchar(6) NOT NULL, \`active\` tinyint NOT NULL DEFAULT 1, \`type\` enum ('register') NOT NULL, \`expires_at\` datetime NOT NULL, \`created_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP, \`updated_at\` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`otps\` ADD CONSTRAINT \`FK_1087c38713c64e9009cfdcac1ee\` FOREIGN KEY (\`user_account_id\`) REFERENCES \`user_account\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`otps\` DROP FOREIGN KEY \`FK_1087c38713c64e9009cfdcac1ee\``);
        await queryRunner.query(`DROP TABLE \`otps\``);
        await queryRunner.query(`DROP TABLE \`notification\``);
    }

}
