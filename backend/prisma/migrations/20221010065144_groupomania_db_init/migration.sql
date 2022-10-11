/*
  Warnings:

  - You are about to alter the column `text` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `VarChar(3000)` to `VarChar(2000)`.

*/
-- AlterTable
ALTER TABLE `Post` MODIFY `text` VARCHAR(2000) NULL;
