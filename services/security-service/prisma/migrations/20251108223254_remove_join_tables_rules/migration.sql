/*
  Warnings:

  - You are about to drop the `module_roles` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile_roles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `module_roles` DROP FOREIGN KEY `module_roles_module_id_fkey`;

-- DropForeignKey
ALTER TABLE `module_roles` DROP FOREIGN KEY `module_roles_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `profile_roles` DROP FOREIGN KEY `profile_roles_profile_id_fkey`;

-- DropForeignKey
ALTER TABLE `profile_roles` DROP FOREIGN KEY `profile_roles_role_id_fkey`;

-- DropTable
DROP TABLE `module_roles`;

-- DropTable
DROP TABLE `profile_roles`;

-- CreateTable
CREATE TABLE `_AccessProfileRoles` (
    `A` INTEGER NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_AccessProfileRoles_AB_unique`(`A`, `B`),
    INDEX `_AccessProfileRoles_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_SystemModuleRoles` (
    `A` VARCHAR(191) NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_SystemModuleRoles_AB_unique`(`A`, `B`),
    INDEX `_SystemModuleRoles_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_AccessProfileRoles` ADD CONSTRAINT `_AccessProfileRoles_A_fkey` FOREIGN KEY (`A`) REFERENCES `access_profile`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_AccessProfileRoles` ADD CONSTRAINT `_AccessProfileRoles_B_fkey` FOREIGN KEY (`B`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SystemModuleRoles` ADD CONSTRAINT `_SystemModuleRoles_A_fkey` FOREIGN KEY (`A`) REFERENCES `roles`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_SystemModuleRoles` ADD CONSTRAINT `_SystemModuleRoles_B_fkey` FOREIGN KEY (`B`) REFERENCES `system_modules`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
