/*
  Warnings:

  - You are about to alter the column `category` on the `foods` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `VarChar(100)`.
  - You are about to alter the column `gender` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(1))` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE `foods` MODIFY `category` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `profile` MODIFY `gender` VARCHAR(100) NOT NULL;
