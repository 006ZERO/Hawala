CREATE TABLE `compliance_cases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`transfer_reference` text NOT NULL,
	`customer_name` text NOT NULL,
	`case_type` text NOT NULL,
	`severity` text NOT NULL,
	`status` text DEFAULT 'Open' NOT NULL,
	`risk_score` integer NOT NULL,
	`reasons` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`assigned_to_email` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `compliance_cases_reference_unique` ON `compliance_cases` (`reference`);
--> statement-breakpoint
INSERT INTO `compliance_cases` (`reference`, `transfer_reference`, `customer_name`, `case_type`, `severity`, `status`, `risk_score`, `reasons`) VALUES ('CASE-1042', 'HW-28490', 'Samira Khalil', 'Velocity and structuring anomaly', 'High', 'Open', 82, '["Four transfers were initiated within 48 hours, 2.6× the customer baseline.","Combined value is close to the enhanced-review threshold.","The beneficiary is new to this customer relationship."]');
--> statement-breakpoint
INSERT INTO `compliance_cases` (`reference`, `transfer_reference`, `customer_name`, `case_type`, `severity`, `status`, `risk_score`, `reasons`) VALUES ('CASE-1041', 'HW-28488', 'Rana Odeh', 'Potential sanctions name match', 'Medium', 'Open', 68, '["The beneficiary name produced a 78% similarity match.","Cross-script transliteration requires analyst confirmation.","No date-of-birth match is present in the available record."]');
--> statement-breakpoint
INSERT INTO `compliance_cases` (`reference`, `transfer_reference`, `customer_name`, `case_type`, `severity`, `status`, `risk_score`, `reasons`) VALUES ('CASE-1040', 'C-1842', 'Mohammad Saleh', 'KYC document expiry', 'Low', 'Open', 31, '["The identity document expires within six days.","Customer activity remains within the established baseline.","Renewed documentation is required before the next transfer."]');
