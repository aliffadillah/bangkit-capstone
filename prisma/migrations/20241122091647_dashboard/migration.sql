/*
  Warnings:

  - A unique constraint covering the columns `[calories]` on the table `foods` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[kcal]` on the table `profile` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[bmi]` on the table `profile` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE `dashboard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `progress_percentage` INTEGER NOT NULL,
    `daily_calories` INTEGER NOT NULL,
    `calories_goal` INTEGER NOT NULL,
    `dashboard_time` DATETIME(3) NOT NULL,
    `daily_sugar` INTEGER NOT NULL,
    `daily_fat` INTEGER NOT NULL,
    `daily_salt` INTEGER NOT NULL,
    `bmi` INTEGER NOT NULL,
    `advices` VARCHAR(1024) NOT NULL,

    UNIQUE INDEX `dashboard_calories_goal_key`(`calories_goal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `foods_calories_key` ON `foods`(`calories`);

-- CreateIndex
CREATE UNIQUE INDEX `profile_kcal_key` ON `profile`(`kcal`);

-- CreateIndex
CREATE UNIQUE INDEX `profile_bmi_key` ON `profile`(`bmi`);

-- AddForeignKey
ALTER TABLE `dashboard` ADD CONSTRAINT `dashboard_bmi_fkey` FOREIGN KEY (`bmi`) REFERENCES `profile`(`bmi`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dashboard` ADD CONSTRAINT `dashboard_calories_goal_fkey` FOREIGN KEY (`calories_goal`) REFERENCES `profile`(`kcal`) ON DELETE RESTRICT ON UPDATE CASCADE;
