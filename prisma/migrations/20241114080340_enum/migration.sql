/*
  Warnings:

  - The values [MALE,FEMALE,OTHER] on the enum `profile_gender` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `profile` MODIFY `gender` ENUM('Male', 'Female') NOT NULL;
