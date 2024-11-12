/*
  Warnings:

  - You are about to alter the column `height` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `weight` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `kcal` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.
  - You are about to alter the column `bmi` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Double`.

*/
-- AlterTable
ALTER TABLE `profile` MODIFY `height` DOUBLE NOT NULL,
    MODIFY `weight` DOUBLE NOT NULL,
    MODIFY `kcal` DOUBLE NULL,
    MODIFY `bmi` DOUBLE NULL;
