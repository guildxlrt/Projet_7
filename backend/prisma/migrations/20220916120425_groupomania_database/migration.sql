/*
  Warnings:

  - You are about to drop the column `text` on the `Post` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `text`,
    ADD COLUMN `content` VARCHAR(191) NULL,
    MODIFY `imageUrl` VARCHAR(191) NULL;
