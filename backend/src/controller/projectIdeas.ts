import type ProjectIdeasService from "../service/projectIdeasService";
import {
  projectIdeaInsertSchema,
  projectIdeaSelectSchema,
  type ProjectIdeaInsetType,
  type ProjectIdeaSelectType,
} from "../types/project-ideas";
import type { NextFunction, Request, Response } from "express";
import { STATUS_CODES } from "../utils/lib";
import type { Res } from "../types/Res";
import { z } from "zod";

export default class ProjectIdeasController {
  private service: ProjectIdeasService;
  constructor(projectIdeasService: ProjectIdeasService) {
    this.service = projectIdeasService;
  }

  async save(
    req: Request<unknown, unknown, ProjectIdeaInsetType[]>,
    res: Response<Res<ProjectIdeaSelectType[]>>,
    next: NextFunction
  ) {
    try {
      const validIdeas = req.body.map((x) => projectIdeaInsertSchema.parse(x));
      const savedList = await this.service.saveProjectIdeas(validIdeas);
      res.status(STATUS_CODES.CREATED).json({
        isSuccess: true,
        message: "Ideas saved successfully",
        result: savedList,
      });
    } catch (error) {
      next(error);
    }
  }

  async delete(
    req: Request<{ id: number }, unknown, unknown>,
    res: Response<Res<{ id: number }[]>>,
    next: NextFunction
  ) {
    try {
      const id = z
        .number({ required_error: "id should be number" })
        .parse(+req.params.id);
      const deleted = await this.service.deleteById(id);
      res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Deleted successfully",
        result: deleted,
      });
    } catch (error) {
      next(error);
    }
  }

  async getByProjectId(
    req: Request<{ projectId: number }, unknown, unknown>,
    res: Response<Res<ProjectIdeaSelectType[]>>,
    next: NextFunction
  ) {
    try {
      const projectId = z
        .number({ required_error: "Invalid project id" })
        .parse(+req.params.projectId);

      const ideaList = await this.service.getProjectIdeasByProjectId(projectId);

      res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Request was successful",
        result: ideaList,
      });
      
    } catch (error) {
      next(error);
    }
  }

  async update(
    req:Request<{id:number},unknown,ProjectIdeaSelectType>,
    res:Response<Res<ProjectIdeaSelectType[]>>,
    next:NextFunction,
  ){
    try {
      const validIdea = projectIdeaSelectSchema.parse(req.body)
      const validId = z.number({required_error:"invalid id param"}).parse(+req.params.id)
      const saved = await this.service.updateById(validIdea,validId)
      res.status(STATUS_CODES.OK).json({
        isSuccess:true,
        message:"Updated Successfully",
        result:saved
      })
    } catch (error) {
      next(error)
    }
  }
}
