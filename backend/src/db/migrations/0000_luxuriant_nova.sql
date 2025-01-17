CREATE TABLE `email_verification` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`code` text NOT NULL,
	`user_id` text NOT NULL,
	`email` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `reset_password` (
	`token_hash` text NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
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
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text(55) NOT NULL,
	`user_id` text NOT NULL,
	`status` text DEFAULT 'TODO',
	`priority` text DEFAULT 'LOW',
	`label` text NOT NULL,
	`description` text(300) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text(150) NOT NULL,
	`email` text NOT NULL,
	`password` text(255) NOT NULL,
	`is_active` integer DEFAULT true,
	`created_at` integer DEFAULT '"2024-07-12T12:47:57.045Z"' NOT NULL,
	`updated_at` integer DEFAULT '"2024-07-12T12:47:57.045Z"' NOT NULL,
	`email_verified` integer DEFAULT false
);
--> statement-breakpoint
CREATE UNIQUE INDEX `email_verification_user_id_unique` ON `email_verification` (`user_id`);--> statement-breakpoint
CREATE UNIQUE INDEX `reset_password_token_hash_unique` ON `reset_password` (`token_hash`);--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);