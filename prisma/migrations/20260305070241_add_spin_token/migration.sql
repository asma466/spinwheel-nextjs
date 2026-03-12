/*
  Warnings:

  - A unique constraint covering the columns `[spinToken]` on the table `BirthdayRecord` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `birthdayrecord` ADD COLUMN `spinToken` VARCHAR(191) NULL,
    ADD COLUMN `tokenExpiresAt` DATETIME(3) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `BirthdayRecord_spinToken_key` ON `BirthdayRecord`(`spinToken`);
