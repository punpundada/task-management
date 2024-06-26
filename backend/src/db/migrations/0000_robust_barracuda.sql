CREATE TABLE `email_verification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text(300) NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'TODO',
	`priority` text DEFAULT 'LOW',
	`label` text NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(150) NOT NULL,
	`email` text NOT NULL,
	`password` text(255) NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` integer DEFAULT '"2024-06-26T19:06:46.183Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2024-06-26T19:06:46.183Z"' NOT NULL,
	`email_verified` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_verification_user_id_unique` ON `email_verification` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);