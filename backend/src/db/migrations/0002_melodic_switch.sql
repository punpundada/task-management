ALTER TABLE `tasks` ADD `project_id` integer NOT NULL REFERENCES projects(id);
