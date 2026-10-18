CREATE TABLE `interview_checkpoints` (
	`owner_id` text NOT NULL,
	`session_id` text NOT NULL,
	`version` integer NOT NULL,
	`payload` text NOT NULL,
	`updated_at` integer NOT NULL,
	PRIMARY KEY(`owner_id`, `session_id`)
);
