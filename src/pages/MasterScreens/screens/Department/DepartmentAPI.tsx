import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getDepartmentList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Department?$select=DepartmentId,DepartmentName,Description,LastModifiedUserId,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getDepartmentById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/Department?$filter=DepartmentId eq ${id}&$select=DepartmentId,DepartmentName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function editDepartment(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Department?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateDepartment(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/Department", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}