/*
  Warnings:

  - You are about to alter the column `bmi` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `profile` ADD COLUMN `photoUrl` VARCHAR(255) NULL,
    MODIFY `bmi` DOUBLE NULL;
