ALTER TABLE `clients` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `clients` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `organization_memberships` MODIFY COLUMN `joined_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `organizations` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `organizations` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `project_memberships` MODIFY COLUMN `joined_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `tasks` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `tasks` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `created_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `users` MODIFY COLUMN `updated_at` timestamp NOT NULL DEFAULT (now());--> statement-breakpoint
ALTER TABLE `organizations` ADD `created_by` varchar(128) NOT NULL;--> statement-breakpoint
ALTER TABLE `organizations` ADD CONSTRAINT `organizations_created_by_users_id_fk` FOREIGN KEY (`created_by`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;