import { axiosInstance } from "@/lib/constants";
import { errorResponse } from "@/lib/utils";
import { ProjectInsetType, ProjectSelectType } from "@/types/project";
import { GenericRes, Options } from "@/types/util";

export default class ProjectService {
  static async saveProject(project: ProjectInsetType) {
    try {
      const savedProject = await axiosInstance.post<GenericRes<ProjectSelectType>>(
        "projects/add",
        project
      );
      return savedProject.data;
    } catch (error) {
      return errorResponse(error);
    }
  }

  static async getOptions(){
    try {
      const res = await axiosInstance.get<GenericRes<Options[]>>("projects/get-options");
      return res.data;
    } catch (error) {
      return errorResponse(error);
    }
  }
}
