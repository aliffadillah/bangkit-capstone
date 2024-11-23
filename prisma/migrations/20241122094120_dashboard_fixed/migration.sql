/*
  Warnings:

  - You are about to drop the column `daily_calories` on the `dashboard` table. All the data in the column will be lost.
  - Added the required column `current_kcal` to the `dashboard` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dashboard` DROP COLUMN `daily_calories`,
    ADD COLUMN `current_kcal` INTEGER NOT NULL;
