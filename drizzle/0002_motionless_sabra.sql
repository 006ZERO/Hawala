CREATE TABLE `customers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`full_name` text NOT NULL,
	`nationality` text NOT NULL,
	`id_type` text NOT NULL,
	`id_number_last4` text NOT NULL,
	`verification_status` text NOT NULL,
	`risk` text NOT NULL,
	`created_by_email` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `customers_reference_unique` ON `customers` (`reference`);