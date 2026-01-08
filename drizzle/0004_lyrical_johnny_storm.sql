ALTER TABLE `projects` MODIFY COLUMN `client_id` varchar(128);--> statement-breakpoint
ALTER TABLE `projects` MODIFY COLUMN `tech_stack` json;