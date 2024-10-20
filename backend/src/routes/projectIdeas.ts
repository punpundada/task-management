import db from "../db";
import { Router } from "express";
import ProjectIdeasService from "../service/projectIdeasService";
import ProjectIdeasController from "../controller/projectIdeas";


const projectIdeasRoute = Router();
const service = new ProjectIdeasService(db)
const controller = new ProjectIdeasController(service)

projectIdeasRoute.post("/add",controller.save.bind(controller))
//save.bind must be called to keep 'this' refrence inside the class 
// because only doing controller.save passes NEW refrence of function 
// else we can do this -->> projectIdeasRoute.post("/add", (req, res, next) => controller.save(req, res, next));
projectIdeasRoute.delete("/delete/:id",controller.delete.bind(controller))
projectIdeasRoute.get("/get/project-id/:projectId",controller.getByProjectId.bind(controller))
projectIdeasRoute.patch("/update/:id",controller.update.bind(controller))

export default projectIdeasRoute