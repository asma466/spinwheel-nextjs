-- AlterTable
ALTER TABLE `employee` ADD COLUMN `role` ENUM('Admin', 'Employee') NOT NULL DEFAULT 'Employee';
