CREATE TABLE new_project_ideas (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    project_id INTEGER NOT NULL,
    title TEXT(25) NOT NULL,
    details TEXT NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects(id) ON UPDATE NO ACTION ON DELETE NO ACTION
);
--> statement-breakpoint
INSERT INTO new_project_ideas (id, project_id, title, details)
SELECT id, project_id, title, details
FROM project_ideas
WHERE project_id IS NOT NULL;
--> statement-breakpoint

DROP TABLE project_ideas;
--> statement-breakpoint
ALTER TABLE new_project_ideas RENAME TO project_ideas;
