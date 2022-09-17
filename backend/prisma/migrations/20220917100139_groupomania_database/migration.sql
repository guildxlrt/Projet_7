/*
  Warnings:

  - You are about to drop the column `title` on the `Like` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Comment` MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Like` DROP COLUMN `title`,
    MODIFY `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
