import type { DefinedUseQueryResult } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { GET_SCREEN_ROUTE } from "@/lib/querykeys";
import { request } from "@/lib/axios";
import type { BaseResponse } from "@/types/baseRespones";
import type { Screen } from "@/types/screen";

const useScreenList = (): DefinedUseQueryResult<Screen[], Error> => {
  return useQuery({
    queryKey: [GET_SCREEN_ROUTE],
    queryFn: async () => {
      const result = await request<BaseResponse<Screen[]>>({
        method: "GET",
        url: "/stm-screen/route",
      });

      return result.data || [];
    },
    initialData: [],
  });
};

export default useScreenList;
