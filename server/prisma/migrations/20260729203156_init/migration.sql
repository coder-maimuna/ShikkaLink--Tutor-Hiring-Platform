-- DropForeignKey
ALTER TABLE `student_profiles` DROP FOREIGN KEY `student_profiles_user_id_fkey`;

-- DropForeignKey
ALTER TABLE `tutor_profiles` DROP FOREIGN KEY `tutor_profiles_user_id_fkey`;

-- AlterTable
ALTER TABLE `tutor_profiles` ADD COLUMN `interview_status` VARCHAR(50) NULL,
    ADD COLUMN `subject` VARCHAR(100) NULL,
    ADD COLUMN `test_score` INTEGER NULL;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `university` VARCHAR(100) NULL;

-- CreateTable
CREATE TABLE `sessions` (
    `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `student_id` INTEGER NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `scheduled_time` DATETIME(3) NOT NULL,
    `status` ENUM('upcoming', 'ongoing', 'completed', 'cancelled') NOT NULL DEFAULT 'upcoming',
    `meeting_link` VARCHAR(255) NULL,
    `duration_minutes` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `availability_slots` (
    `slot_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `day_of_week` VARCHAR(20) NOT NULL,
    `time_slot` VARCHAR(20) NOT NULL,
    `subject` VARCHAR(100) NOT NULL,

    PRIMARY KEY (`slot_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `practice_tests` (
    `test_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `assigned_to` INTEGER NULL,
    `title` VARCHAR(150) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `question_count` INTEGER NOT NULL DEFAULT 0,
    `status` ENUM('draft', 'pending', 'published') NOT NULL DEFAULT 'draft',
    `assign_date` DATETIME(3) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`test_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tuition_board` (
    `listing_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `subject` VARCHAR(100) NOT NULL,
    `days_per_week` INTEGER NOT NULL,
    `hours_per_session` INTEGER NOT NULL,
    `rate_bdt` INTEGER NOT NULL,
    `mode` VARCHAR(20) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`listing_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `complaints` (
    `complaint_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `description` TEXT NOT NULL,
    `status` ENUM('open', 'resolved') NOT NULL DEFAULT 'open',
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`complaint_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
