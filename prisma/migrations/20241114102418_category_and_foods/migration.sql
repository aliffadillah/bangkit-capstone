/*
  Warnings:

  - The values [MALE,FEMALE,OTHER] on the enum `profile_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `profile` MODIFY `gender` ENUM('Pria', 'Wanita') NOT NULL;

-- CreateTable
CREATE TABLE `Foods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_makanan` VARCHAR(100) NOT NULL,
    `category` ENUM('Makanan_Ringan', 'Makanan_Berat', 'Snack', 'Minuman') NOT NULL,
    `calories` INTEGER NOT NULL,
    `fats` INTEGER NOT NULL,
    `salt` INTEGER NOT NULL,
    `date_added` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
