/*
  Warnings:

  - You are about to alter the column `title` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(150)`.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `title` VARCHAR(150) NULL,
    MODIFY `text` VARCHAR(1500) NULL;
