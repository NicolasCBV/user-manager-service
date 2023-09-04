import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1688789695814 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE IF NOT EXISTS db.users (
                id VARCHAR(191) NOT NULL,
                name VARCHAR(64) NOT NULL,
                email VARCHAR(256) NOT NULL,
                password VARCHAR(256) NOT NULL,
                description VARCHAR(256) NULL,
                imageUrl VARCHAR(256) NULL,
                level INT,
                createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
                updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

                UNIQUE INDEX users_name_key(name),
                UNIQUE INDEX users_email_key(email),
                INDEX users_level_key(level),
                PRIMARY KEY (id)
            ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query('DROP TABLE db.users');
  }
}
