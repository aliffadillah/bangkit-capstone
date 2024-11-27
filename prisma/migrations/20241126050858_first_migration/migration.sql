-- CreateTable
CREATE TABLE `users` (
    `username` VARCHAR(100) NOT NULL,
    `password` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `token` VARCHAR(1024) NULL,

    UNIQUE INDEX `users_username_key`(`username`),
    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `profile` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `age` INTEGER NOT NULL,
    `gender` ENUM('Laki_Laki', 'Perempuan') NOT NULL,
    `height` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `kcal` INTEGER NULL,
    `bmi` INTEGER NULL,
    `username` VARCHAR(100) NOT NULL,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `photoUrl` VARCHAR(255) NULL,

    UNIQUE INDEX `profile_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `foods` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nama_makanan` VARCHAR(100) NOT NULL,
    `category` ENUM('Makanan Berat', 'Makanan Ringan', 'Minuman Non-Soda', 'Minuman Bersoda', 'Minuman Sehat', 'Produk Beku') NOT NULL,
    `calories` INTEGER NOT NULL,
    `sugar` INTEGER NOT NULL,
    `fats` INTEGER NOT NULL,
    `salt` INTEGER NOT NULL,
    `date_added` DATETIME(3) NOT NULL,
    `username` VARCHAR(100) NOT NULL,
    `grade` VARCHAR(10) NULL,

    UNIQUE INDEX `foods_calories_key`(`calories`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dashboard` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `progress_percentage` INTEGER NOT NULL,
    `current_kcal` INTEGER NOT NULL,
    `calories_goal` INTEGER NOT NULL,
    `dashboard_time` DATETIME(3) NOT NULL,
    `daily_sugar` INTEGER NOT NULL,
    `daily_fat` INTEGER NOT NULL,
    `daily_salt` INTEGER NOT NULL,
    `bmi` INTEGER NOT NULL,
    `advices` VARCHAR(1024) NOT NULL,
    `profileId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `profile` ADD CONSTRAINT `profile_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `foods` ADD CONSTRAINT `foods_username_fkey` FOREIGN KEY (`username`) REFERENCES `users`(`username`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dashboard` ADD CONSTRAINT `dashboard_profileId_fkey` FOREIGN KEY (`profileId`) REFERENCES `profile`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
