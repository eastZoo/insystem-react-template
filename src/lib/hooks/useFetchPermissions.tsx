import { useQuery } from "@tanstack/react-query";
import { request } from "../axios";
import type { Permission } from "@/types/permission";
import { useSetRecoilState } from "recoil";
import { permissionsState } from "@/store/permission";
import { readAccessToken } from "../functions/authFunctions";
import { GET_GROUP_PERMISSIONS } from "../querykeys";
import { permissionDummy } from "../data/permissionDummy";

const useFetchPermissions = () => {
  const setPermissions = useSetRecoilState(permissionsState);
  setPermissions(permissionDummy);
  // const accessToken = readAccessToken();
  // const { data: permissions } = useQuery<any>({
  //   queryKey: [GET_GROUP_PERMISSIONS],
  //   queryFn: async () => {
  //     if (!accessToken) {
  //       console.log("keepPreviousData", permissionDummy);
  //       setPermissions(permissionDummy);
  //       return [];
  //     }

  //     const resPermissions = await request<Permission[]>({
  //       method: "GET",
  //       url: "/stm-permission",
  //     });

  //     setPermissions(resPermissions);

  //     return resPermissions;
  //   },
  //   placeholderData: permissionDummy,
  // });

  // return permissions;
  return permissionDummy;
};

export default useFetchPermissions;
