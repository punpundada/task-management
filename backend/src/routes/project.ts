import { Router } from "express";
import ProjectController from "../controller/Project";

const projectRouter = Router();

projectRouter.post("/add", ProjectController.saveProject);
projectRouter.get("/get", ProjectController.getProjects);
projectRouter.get("/get-options", ProjectController.getProjectsOptions);
projectRouter.get("/get/:id", ProjectController.getProject);
projectRouter.post("/update/:id", ProjectController.updateProject);
projectRouter.delete("/delete/:id", ProjectController.deleteProject);

export default projectRouter;
