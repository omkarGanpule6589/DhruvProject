import { api } from "../../../components/API/apiConfig";
import { getSessionToken } from "../../../components/AuthUser";

export function getpermissions(id) {
  const accessToken = getSessionToken();

  return api.get(
    `odata/role?filter=RoleId eq ${id}&$expand=RolePermissions($filter=IsDeleted ne true;$expand=Permission)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getpermissionsByroleid(id) {
  const accessToken = getSessionToken();

  return api.get(
    `odata/RolePermisiionFetch/${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
