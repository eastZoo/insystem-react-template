import { useQuery } from "@tanstack/react-query";
import { request } from "../api";
import { GET_PROJECTS } from "../querykeys";
import { BaseResponse } from "../types/baseRespones";
import { Project } from "../types/project";

const useProjectRegister = (searchInputs: any) => {
  return useQuery({
    queryKey: [GET_PROJECTS, searchInputs],
    queryFn: async () => {
      const result = await request<BaseResponse<Project[]>>({
        method: "GET",
        url: "/project-register",
        params: searchInputs,
      });

      return result.data || [];
    },
    initialData: [],
  });
};

export default useProjectRegister;
