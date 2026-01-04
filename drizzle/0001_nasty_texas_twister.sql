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
CREATE TABLE `tasks` (
	`id` varchar(128) NOT NULL,
	`organization_id` varchar(128) NOT NULL,
	`project_id` varchar(128) NOT NULL,
	`title` varchar(256) NOT NULL,
	`description` varchar(1024),
	`assigned_to` varchar(128),
	`status` enum('CREATED','ASSIGNED','COMPLETED','OVERDUE') NOT NULL,
	`priority` enum('LOW','MEDIUM','HIGH') NOT NULL,
	`due_date` date,
	`created_at` datetime NOT NULL,
	`updated_at` datetime NOT NULL,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `clients` ADD CONSTRAINT `clients_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_memberships` ADD CONSTRAINT `project_memberships_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `project_memberships` ADD CONSTRAINT `project_memberships_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `projects` ADD CONSTRAINT `projects_client_id_clients_id_fk` FOREIGN KEY (`client_id`) REFERENCES `clients`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_project_id_projects_id_fk` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `tasks` ADD CONSTRAINT `tasks_assigned_to_users_id_fk` FOREIGN KEY (`assigned_to`) REFERENCES `users`(`id`) ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_memberships` ADD CONSTRAINT `organization_memberships_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_memberships` ADD CONSTRAINT `organization_memberships_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;