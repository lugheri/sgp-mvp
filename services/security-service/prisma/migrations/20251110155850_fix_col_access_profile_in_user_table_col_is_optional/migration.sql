-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_access_profile_fkey`;

-- DropIndex
DROP INDEX `users_access_profile_fkey` ON `users`;

-- AlterTable
ALTER TABLE `users` MODIFY `access_profile` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_access_profile_fkey` FOREIGN KEY (`access_profile`) REFERENCES `access_profile`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
