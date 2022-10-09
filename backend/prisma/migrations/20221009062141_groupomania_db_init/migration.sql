-- AlterTable
ALTER TABLE `Comment` ADD COLUMN `updated` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Post` ADD COLUMN `updated` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `video` VARCHAR(191) NULL;
