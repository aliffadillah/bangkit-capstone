/*
  Warnings:

  - You are about to alter the column `category` on the `foods` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `Enum(EnumId(1))`.

*/
-- AlterTable
ALTER TABLE `foods` MODIFY `category` ENUM('Makanan Berat', 'Makanan Ringan', 'Minuman Bersoda', 'Minuman Sehat', 'Produk Beku') NOT NULL;
