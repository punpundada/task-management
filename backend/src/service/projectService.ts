import { and, eq } from "drizzle-orm";
import db from "../db";
import { projectTable } from "../db/schema";
import {
  projectInsertSchema,
  projectSelectScema,
  type ProjectInsetType,
  type ProjectSelectType,
} from "../types/projects";
import z from "zod";
export default class ProjectService {
  static async saveProject(project: ProjectInsetType) {
    const validProject = projectInsertSchema.parse(project);
    const savedProject = await db.insert(projectTable).values(validProject).returning();
    return savedProject;
  }

  static async getProjectByUserId(userId: string) {
    const projects = await db.query.projectTable.findMany({
      where: (fields, operators) => operators.eq(fields.userId, userId),
    });
    return projects;
  }

  static async getProjectByProjectId(id: number) {
    const validId = z.number().parse(+id);
    const project = await db.query.projectTable.findFirst({
      where: (field, operator) => operator.eq(field.id, validId),
    });
    return project;
  }

  static async updateProject(project: ProjectSelectType) {
    const validProject = projectSelectScema.parse(project);
    const updatedProject = await db
      .update(projectTable)
      .set({ name: validProject.name })
      .where(
        and(eq(projectTable.id, project.id), eq(projectTable.userId, project.userId))
      )
      .returning();
    return updatedProject;
  }

  static async deleteProjectById(id: number, userId: string) {
    const validId = z.number().parse(+id);
    const deletedId = await db
      .delete(projectTable)
      .where(and(eq(projectTable.id, validId), eq(projectTable.userId, userId)))
      .returning({ id: projectTable.id });
    return deletedId?.[0]?.id;
  }
}
