import type { db } from "../db/index";
import type {
  ProjectIdeaInsetType,
  ProjectIdeaSelectType,
} from "../types/project-ideas";
import projectIdeaTable from "../db/schema/proejctIdeas";
import { eq } from "drizzle-orm";
import { CustomError, STATUS_CODES } from "../utils/lib";

export default class ProjectIdeasService {
  private db: db;
  constructor(db: db) {
    this.db = db;
  }

  async saveProjectIdeas(projectIdeas: ProjectIdeaInsetType[]) {
    const savedList = await this.db
      .insert(projectIdeaTable)
      .values(projectIdeas)
      .returning();
    return savedList;
  }

  async getProjectIdeasByProjectId(projectId: number) {
    const list = await this.db.query.projectIdea.findMany({
      where: ({ projectId }, { eq }) => eq(projectId, projectId),
    });
    return list;
  }

  async deleteById(id: number) {
    return await this.db
      .delete(projectIdeaTable)
      .where(eq(projectIdeaTable.id, id))
      .returning({ id: projectIdeaTable.id });
  }

  async updateById(projectIdea: ProjectIdeaSelectType,id:number) {
    if (!projectIdea.id) {
      throw new CustomError("id cannot be null",STATUS_CODES.BAD_REQUEST);
    }
    if (projectIdea.id != id){
      throw new CustomError(`ids do not match`,STATUS_CODES.BAD_REQUEST);
    }
    const data = await this.db.query.projectIdea.findFirst({
      where:eq(projectIdeaTable.id,id)
    })
    if(!data){
      throw new CustomError(`Project idea with id ${id} does not exist`,STATUS_CODES.BAD_REQUEST);
    }
    return this.db
      .update(projectIdeaTable)
      .set(projectIdea)
      .where(eq(projectIdeaTable.id, projectIdea.id ?? 0)).returning();
  }
}