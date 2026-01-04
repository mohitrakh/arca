CREATE TABLE `organization_memberships` (
	`id` varchar(128) NOT NULL,
	`organization_id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`role` enum('ORG_ADMIN','MEMBER') NOT NULL,
	`is_active` boolean NOT NULL,
	`joined_at` datetime NOT NULL,
	CONSTRAINT `organization_memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `organizations` (
	`id` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` varchar(2000),
	`is_active` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `organizations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` varchar(128) NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(255) NOT NULL,
	`password_hash` varchar(255) NOT NULL,
	`is_active` boolean NOT NULL,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `users_id` PRIMARY KEY(`id`)
);
