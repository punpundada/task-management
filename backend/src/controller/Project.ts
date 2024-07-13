import type { NextFunction } from "express";
import type { Res } from "../types/Res";
import type { Request, Response } from "express";
import type { ProjectInsetType, ProjectSelectType } from "../types/projects";
import { getUserOrError, STATUS_CODES } from "../utils/lib";
import ProjectService from "../service/projectService";
import TasksService from "../service/taskService";
import type { Option } from "../types/utils";
export default class ProjectController {
  static async saveProject(
    req: Request<unknown, unknown, ProjectInsetType>,
    res: Response<Res<ProjectSelectType[]>>,
    next: NextFunction
  ) {
    try {
      req.body.userId = getUserOrError(res.locals).user.id;
      const savedProject = await ProjectService.saveProject(req.body);
      if (savedProject?.[0]) {
        return res.status(STATUS_CODES.CREATED).json({
          isSuccess: true,
          message: "Project saved succssfully",
          result: savedProject,
        });
      } else {
        return res.status(STATUS_CODES.CREATED).json({
          isSuccess: false,
          message: "Someting went wrong",
          issues: [],
        });
      }
    } catch (error) {
      next(error);
    }
  }

  static async getProjectsOptions(
    req: Request<unknown, unknown, unknown>,
    res: Response<Res<Option[]>>,
    next: NextFunction
  ) {
    try {
      const projects = await ProjectService.getProjectByUserId(
        getUserOrError(res.locals).user.id
      );
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Request was successful",
        result: projects.map((x) => ({ value: x.id.toString(), label: x.name })) ?? [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProjects(
    req: Request<unknown, unknown, unknown>,
    res: Response<Res<ProjectSelectType[]>>,
    next: NextFunction
  ) {
    try {
      const projects = await ProjectService.getProjectByUserId(
        getUserOrError(res.locals).user.id
      );
      return res.status(STATUS_CODES.OK).json({
        isSuccess: true,
        message: "Request was successful",
        result: projects ?? [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async getProject(
    req: Request<{ id: number }, unknown, unknown>,
    res: Response<Res<ProjectSelectType>>,
    next: NextFunction
  ) {
    try {
      const project = await ProjectService.getProjectByProjectId(req.params.id);
      if (project) {
        return res.status(STATUS_CODES.OK).json({
          isSuccess: true,
          message: "Request was successful",
          result: project,
        });
      }
      return res.status(STATUS_CODES.NOT_FOUND).json({
        isSuccess: false,
        message: "Project not found",
        issues: [],
      });
    } catch (error) {
      next(error);
    }
  }

  static async updateProject(
    req: Request<{ id: number }, unknown, ProjectSelectType>,
    res: Response<Res<ProjectSelectType>>,
    next: NextFunction
  ) {
    try {
      if (req.params.id.toString() !== req.body.id.toString()) {
        return res.status(STATUS_CODES.BAD_REQUEST).json({
          isSuccess: false,
          issues: [],
          message: "Invalid id",
        });
      }
      req.body.userId = getUserOrError(res.locals).user.id;
      const updatedProject = await ProjectService.updateProject(req.body);
      if (updatedProject?.[0]) {
        return res.status(STATUS_CODES.OK).json({
          isSuccess: true,
          message: "Project updated successfully",
          result: updatedProject?.[0],
        });
      }
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        isSuccess: false,
        message: "Something went wrong",
        issues: [],
      });
    } catch (error) {
      next(error);
    }
  }
  static async deleteProject(
    req: Request<{ id: number }, unknown, unknown>,
    res: Response<Res<number>>,
    next: NextFunction
  ) {
    try {
      const id = await ProjectService.deleteProjectById(
        req.params.id,
        getUserOrError(res.locals).user.id
      );
      if (id) {
        return res.status(STATUS_CODES.OK).json({
          isSuccess: true,
          message: "Project deleted successfully",
          result: id,
        });
      }
      return res.status(STATUS_CODES.NOT_FOUND).json({
        isSuccess: false,
        issues: [],
        message: "Project not found",
      });
    } catch (error) {
      next(error);
    }
  }
}
