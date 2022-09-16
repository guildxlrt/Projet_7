/*
  Warnings:

  - You are about to drop the column `inscripion` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `User` DROP COLUMN `inscripion`,
    ADD COLUMN `dateInscription` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    MODIFY `avatarUrl` VARCHAR(191) NULL;
