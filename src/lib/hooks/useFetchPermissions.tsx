import type { Permission } from "@/types/permission";
import { permissionsState } from "@/store/permission";
import { permissionDummy } from "../data/permissionDummy";

const useFetchPermissions = () => {
  permissionsState.set(permissionDummy as Permission[]);
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
