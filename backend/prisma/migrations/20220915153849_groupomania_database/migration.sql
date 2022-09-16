/*
  Warnings:

  - You are about to drop the column `dateInscription` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `dateInscription`,
    ADD COLUMN `signupDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    MODIFY `birthday` DATETIME(3) NULL;
