-- CreateTable
CREATE TABLE `tutor_education` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `current_institution` VARCHAR(200) NULL,
    `current_level` VARCHAR(100) NULL,
    `current_subject` VARCHAR(100) NULL,
    `current_grad_year` VARCHAR(10) NULL,
    `current_gpa` VARCHAR(10) NULL,
    `prev_institution` VARCHAR(200) NULL,
    `prev_level` VARCHAR(100) NULL,
    `prev_subject` VARCHAR(100) NULL,
    `prev_grad_year` VARCHAR(10) NULL,
    `prev_gpa` VARCHAR(10) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutor_preferences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `subjects` VARCHAR(200) NULL,
    `class_range` VARCHAR(200) NULL,
    `preferred_gender` VARCHAR(50) NULL,
    `tuition_type` VARCHAR(100) NULL,
    `salary_range_min` INTEGER NULL,
    `salary_range_max` INTEGER NULL,
    `preferred_curriculum` VARCHAR(100) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tutor_preferences_tutor_id_key`(`tutor_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutor_experiences` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `institution` VARCHAR(200) NULL,
    `class_range` VARCHAR(100) NULL,
    `subjects` VARCHAR(200) NULL,
    `duration` VARCHAR(50) NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tutor_documents` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tutor_id` INTEGER NOT NULL,
    `document_type` VARCHAR(100) NOT NULL,
    `file_name` VARCHAR(200) NULL,
    `file_url` TEXT NULL,
    `uploaded_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
