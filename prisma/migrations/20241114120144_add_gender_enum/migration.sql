/*
  Warnings:

  - You are about to alter the column `gender` on the `profile` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `profile` MODIFY `gender` ENUM('Laki_Laki', 'Perempuan') NOT NULL;
