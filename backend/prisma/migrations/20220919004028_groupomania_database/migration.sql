-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true;
