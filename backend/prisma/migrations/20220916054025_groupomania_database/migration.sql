/*
  Warnings:

  - You are about to drop the column `date` on the `Post` table. All the data in the column will be lost.
  - You are about to alter the column `test` on the `Test` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Decimal(65,30)`.

*/
-- AlterTable
ALTER TABLE `Post` DROP COLUMN `date`,
    ADD COLUMN `creationDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Test` ADD COLUMN `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `test` DECIMAL(65, 30) NOT NULL;
