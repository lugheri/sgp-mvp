-- CreateTable
CREATE TABLE `accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `account_owner` INTEGER NOT NULL,
    `account_name` VARCHAR(191) NOT NULL,
    `company_name` VARCHAR(191) NOT NULL,
    `terms_agreed` TINYINT NOT NULL,
    `public_ip` VARCHAR(191) NOT NULL DEFAULT '',
    `local_ip` VARCHAR(191) NOT NULL DEFAULT '',
    `setup_environment` INTEGER NOT NULL,
    `active` TINYINT NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
