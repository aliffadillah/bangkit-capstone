/*
  Warnings:

  - You are about to drop the `Foods` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Foods`;

-- CreateTable
CREATE TABLE `foods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_makanan` VARCHAR(100) NOT NULL,
    `category` ENUM('Makanan_Ringan', 'Makanan_Berat', 'Snack', 'Minuman') NOT NULL,
    `calories` INTEGER NOT NULL,
    `fats` INTEGER NOT NULL,
    `salt` INTEGER NOT NULL,
    `date_added` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
