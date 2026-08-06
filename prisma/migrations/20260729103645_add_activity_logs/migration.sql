-- CreateTable
CREATE TABLE `ActivityLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` VARCHAR(191) NULL,
    `userName` VARCHAR(191) NOT NULL,
    `userEmail` VARCHAR(191) NOT NULL,
    `action` ENUM('CREATE', 'UPDATE', 'DELETE', 'ASSIGN', 'RECEIVED', 'LOGIN', 'LOGOUT', 'EMAIL', 'SPIN') NOT NULL,
    `module` ENUM('EMPLOYEES', 'GIFTS', 'BIRTHDAYS', 'SETTINGS', 'AUTH') NOT NULL,
    `description` TEXT NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ActivityLog_module_idx`(`module`),
    INDEX `ActivityLog_action_idx`(`action`),
    INDEX `ActivityLog_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
