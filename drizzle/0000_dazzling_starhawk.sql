CREATE TABLE `transfers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_initials` text NOT NULL,
	`destination` text NOT NULL,
	`amount_jod` integer NOT NULL,
	`purpose` text NOT NULL,
	`risk` text NOT NULL,
	`status` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `transfers_reference_unique` ON `transfers` (`reference`);