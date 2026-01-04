CREATE TABLE `clients` (
	`id` varchar(128) NOT NULL,
	`organization_id` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` varchar(1024),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `clients_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
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
CREATE TABLE `project_memberships` (
	`id` varchar(128) NOT NULL,
	`project_id` varchar(128) NOT NULL,
	`user_id` varchar(128) NOT NULL,
	`role` enum('PROJECT_MANAGER','DEVELOPER','DESIGNER','TESTER') NOT NULL,
	`is_active` boolean NOT NULL,
	`joined_at` datetime NOT NULL,
	CONSTRAINT `project_memberships_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` varchar(128) NOT NULL,
	`organization_id` varchar(128) NOT NULL,
	`client_id` varchar(128) NOT NULL,
	`name` varchar(256) NOT NULL,
	`description` varchar(1024),
	`start_date` date,
	`due_date` date,
	`tech_stack` varchar(512),
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`)
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
--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_memberships` ADD CONSTRAINT `organization_memberships_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_memberships` ADD CONSTRAINT `organization_memberships_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_memberships` ADD CONSTRAINT `project_memberships_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_memberships` ADD CONSTRAINT `project_memberships_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;