import { api } from "../../../../components/API/apiConfig";

export function getRolepermissionList() {
  return api.get(
    `/odata/RolePermission?Select=RolePermissionId,RoleId,PermissionId`
  );
}

export function getRoleList() {
  return api.get(`/odata/Role?$select=RoleId,RoleName`);
}

export function getPermissionList() {
  return api.get(`/odata/Permission?$select=PermissionId,PermissionName`);
}

export function getRolePermissionById(id) {
  return api.get(`/odata/RolePermission?$filter=RolePermissionId eq ${id}`);
}

export function CreateRolePermission(params) {
  return api.post("/odata/RolePermission", params);
}
