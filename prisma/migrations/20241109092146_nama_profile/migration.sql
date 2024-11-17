/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `profile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `profile` ADD COLUMN `email` VARCHAR(100) NOT NULL,
    ADD COLUMN `name` VARCHAR(100) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `profile_username_key` ON `profile`(`username`);

-- CreateIndex
CREATE UNIQUE INDEX `profile_name_key` ON `profile`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `profile_email_key` ON `profile`(`email`);

-- CreateIndex
CREATE UNIQUE INDEX `users_name_key` ON `users`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `users_email_key` ON `users`(`email`);

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_name_fkey` FOREIGN KEY (`name`) REFERENCES `users`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_email_fkey` FOREIGN KEY (`email`) REFERENCES `users`(`email`) ON DELETE RESTRICT ON UPDATE CASCADE;
