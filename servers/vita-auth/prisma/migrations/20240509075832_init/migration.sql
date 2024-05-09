-- CreateTable
CREATE TABLE `va_users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NULL,
    `email` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `password` VARCHAR(191) NOT NULL,
    `avatar` TEXT NULL,
    `create_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `update_at` DATETIME(3) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `va_users_user_id_key`(`user_id`),
    UNIQUE INDEX `va_users_username_key`(`username`),
    UNIQUE INDEX `va_users_email_key`(`email`),
    UNIQUE INDEX `va_users_phone_key`(`phone`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `va_clients` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `client_id` VARCHAR(191) NOT NULL,
    `client_name` VARCHAR(191) NOT NULL,
    `client_secret` VARCHAR(191) NOT NULL,
    `redirect_uri` VARCHAR(191) NULL,
    `grants` VARCHAR(191) NOT NULL DEFAULT 'password,refresh_token',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `scope` VARCHAR(191) NULL DEFAULT 'basic',

    UNIQUE INDEX `va_clients_client_id_key`(`client_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `va_access_tokens` (
    `user_id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `access_token` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `va_refresh_tokens` (
    `user_id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `refresh_token` VARCHAR(255) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `va_authorization_codes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `client_id` VARCHAR(191) NOT NULL,
    `redirect_uri` VARCHAR(191) NOT NULL,
    `expires_at` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `va_casbin_rules` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `ptype` VARCHAR(100) NOT NULL,
    `v0` VARCHAR(100) NULL,
    `v1` VARCHAR(100) NULL,
    `v2` VARCHAR(100) NULL,
    `v3` VARCHAR(100) NULL,
    `v4` VARCHAR(100) NULL,
    `v5` VARCHAR(100) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `va_roles` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_id` VARCHAR(191) NOT NULL,
    `role_name` VARCHAR(100) NULL,
    `description` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(3) NULL,
    `sort` INTEGER NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `va_roles_role_id_key`(`role_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `va_resources` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `resource_id` VARCHAR(191) NOT NULL,
    `resource_code` VARCHAR(191) NOT NULL,
    `resource_type` TINYINT UNSIGNED NOT NULL,
    `resource_name` VARCHAR(100) NULL,
    `resource_icon` VARCHAR(100) NULL,
    `resource_path` VARCHAR(100) NULL,
    `parent_id` INTEGER NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NULL,
    `sort` TINYINT UNSIGNED NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `va_resources_resource_id_key`(`resource_id`),
    UNIQUE INDEX `va_resources_resource_code_key`(`resource_code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `va_resources` ADD CONSTRAINT `va_resources_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `va_resources`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
