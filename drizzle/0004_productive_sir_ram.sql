CREATE TABLE `audit_events` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`event_type` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_reference` text NOT NULL,
	`action` text NOT NULL,
	`outcome` text NOT NULL,
	`metadata` text DEFAULT '{}' NOT NULL,
	`actor_email` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `audit_events_reference_unique` ON `audit_events` (`reference`);--> statement-breakpoint
CREATE TABLE `brokers` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`legal_name` text NOT NULL,
	`trading_name` text NOT NULL,
	`jurisdiction` text NOT NULL,
	`city` text NOT NULL,
	`license_number_last4` text NOT NULL,
	`beneficial_owner_status` text NOT NULL,
	`compliance_officer_email` text NOT NULL,
	`corridors` text NOT NULL,
	`prefunded_balance_jod` integer DEFAULT 0 NOT NULL,
	`net_position_jod` integer DEFAULT 0 NOT NULL,
	`risk` text DEFAULT 'Low' NOT NULL,
	`status` text DEFAULT 'Pending' NOT NULL,
	`created_by_email` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brokers_reference_unique` ON `brokers` (`reference`);--> statement-breakpoint
INSERT INTO `brokers` (`reference`, `legal_name`, `trading_name`, `jurisdiction`, `city`, `license_number_last4`, `beneficial_owner_status`, `compliance_officer_email`, `corridors`, `prefunded_balance_jod`, `net_position_jod`, `risk`, `status`, `created_by_email`) VALUES
('BR-JO-014', 'Al Noor Exchange LLC', 'Al Noor Exchange', 'Jordan', 'Amman', '1041', 'Verified', 'compliance@synthetic.invalid', '["Egypt","Pakistan"]', 18420, 3260, 'Low', 'Active', 'seed@synthetic.invalid'),
('BR-EG-032', 'Cairo Trust Remittance SAE', 'Cairo Trust Remit', 'Egypt', 'Cairo', '2032', 'Verified', 'compliance@synthetic.invalid', '["Jordan"]', 12780, -3260, 'Low', 'Active', 'seed@synthetic.invalid'),
('BR-PK-008', 'PakLink Services Private Limited', 'PakLink Services', 'Pakistan', 'Lahore', '4008', 'Verified', 'compliance@synthetic.invalid', '["Jordan"]', 24400, -4850, 'Low', 'Active', 'seed@synthetic.invalid'),
('BR-JO-021', 'Bayan Remittance LLC', 'Bayan Remittance', 'Jordan', 'Amman', '7021', 'Pending review', 'compliance@synthetic.invalid', '["Philippines"]', 9650, 680, 'Medium', 'Pending', 'seed@synthetic.invalid');--> statement-breakpoint
CREATE TABLE `platform_settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL,
	`updated_by_email` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `platform_settings_key_unique` ON `platform_settings` (`key`);--> statement-breakpoint
INSERT INTO `platform_settings` (`key`, `value`, `updated_by_email`) VALUES
('screening_rules', '{"sanctions":true,"pep":true,"adverseMedia":false,"velocity":true}', 'seed@synthetic.invalid'),
('retention_years', '7', 'seed@synthetic.invalid'),
('case_approval_threshold', '70', 'seed@synthetic.invalid'),
('environment_mode', '"demonstration"', 'seed@synthetic.invalid');--> statement-breakpoint
CREATE TABLE `regulatory_filings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`case_reference` text NOT NULL,
	`filing_type` text DEFAULT 'STR' NOT NULL,
	`status` text DEFAULT 'Draft' NOT NULL,
	`narrative` text NOT NULL,
	`approved_by_email` text DEFAULT '' NOT NULL,
	`demo_receipt` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `regulatory_filings_reference_unique` ON `regulatory_filings` (`reference`);--> statement-breakpoint
CREATE TABLE `settlement_cycles` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`reference` text NOT NULL,
	`cycle_label` text NOT NULL,
	`gross_amount_jod` integer NOT NULL,
	`net_amount_jod` integer NOT NULL,
	`status` text DEFAULT 'Ready' NOT NULL,
	`proof_mode` text DEFAULT 'Database audit record' NOT NULL,
	`reconciliation_note` text DEFAULT '' NOT NULL,
	`approved_by_email` text DEFAULT '' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`settled_at` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settlement_cycles_reference_unique` ON `settlement_cycles` (`reference`);--> statement-breakpoint
ALTER TABLE `compliance_cases` ADD `detection_mode` text DEFAULT 'Rules + illustrative model' NOT NULL;--> statement-breakpoint
ALTER TABLE `compliance_cases` ADD `rule_codes` text DEFAULT '[]' NOT NULL;--> statement-breakpoint
ALTER TABLE `compliance_cases` ADD `rule_version` text DEFAULT 'rules-3.4' NOT NULL;--> statement-breakpoint
ALTER TABLE `compliance_cases` ADD `model_version` text DEFAULT 'demo-risk-0.3' NOT NULL;--> statement-breakpoint
ALTER TABLE `compliance_cases` ADD `evidence_provenance` text DEFAULT 'Synthetic demonstration dataset' NOT NULL;--> statement-breakpoint
ALTER TABLE `compliance_cases` ADD `override_reason` text DEFAULT '' NOT NULL;--> statement-breakpoint
UPDATE `compliance_cases` SET `rule_codes` = '["VEL-004","AMT-012","BEN-003"]', `detection_mode` = 'Deterministic rules + illustrative risk score' WHERE `reference` = 'CASE-1042';--> statement-breakpoint
UPDATE `compliance_cases` SET `rule_codes` = '["NAME-007","XSC-002"]', `detection_mode` = 'Fuzzy-name rule; no model conclusion' WHERE `reference` = 'CASE-1041';--> statement-breakpoint
UPDATE `compliance_cases` SET `rule_codes` = '["DOC-EXP-001"]', `detection_mode` = 'Deterministic document-expiry rule' WHERE `reference` = 'CASE-1040';
