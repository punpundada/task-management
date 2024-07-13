import ProjectService from "@/services/projectService";
import { Options } from "@/types/util";
import React from "react";

export const useProjectsList = () => {

  const [list, setList] = React.useState<Options[]>([]);

  React.useEffect(() => {
    const fetchList = async () => {
      const res = await ProjectService.getOptions();
      if (res.isSuccess) {
        setList(res.result);
      }
    };
    fetchList();
  }, [setList]);

  return list;
};
