CREATE TABLE `organization_invites` (
	`id` varchar(128) NOT NULL,
	`email` varchar(255) NOT NULL,
	`organization_id` varchar(128) NOT NULL,
	`inviter_id` varchar(128) NOT NULL,
	`role` enum('ORG_ADMIN','MEMBER') NOT NULL DEFAULT 'MEMBER',
	`status` enum('PENDING','ACCEPTED','DECLINED','EXPIRED') NOT NULL DEFAULT 'PENDING',
	`token` varchar(255) NOT NULL,
	`expires_at` timestamp NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `organization_invites_id` PRIMARY KEY(`id`),
	CONSTRAINT `organization_invites_token_unique` UNIQUE(`token`)
);
--> statement-breakpoint
ALTER TABLE `organization_invites` ADD CONSTRAINT `organization_invites_organization_id_organizations_id_fk` FOREIGN KEY (`organization_id`) REFERENCES `organizations`(`id`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `organization_invites` ADD CONSTRAINT `organization_invites_inviter_id_users_id_fk` FOREIGN KEY (`inviter_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action;