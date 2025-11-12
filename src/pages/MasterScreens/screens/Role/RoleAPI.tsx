import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getRoleList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Role?$select=RoleId,RoleName,LastModifiedUserId,CreatedDateTime&$expand=CreatedUser
`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getRoleById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/Role?$filter=RoleId eq ${id}&$select=RoleId,RoleName,LastModifiedDateTime&$expand=LastModifiedUser,RolePermissions($expand=Permission;$filter=IsDeleted ne true),ChildRoleRoles($expand=RoleIdInheritedNavigation;$filter=IsDeleted ne true)`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function editRole(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Role?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createRole(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/Role`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getPermissonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Permission`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}