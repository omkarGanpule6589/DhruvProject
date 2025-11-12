import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEmployeeGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EmployeeGroup?$select=EmployeeGroupId,EmployeeGroupName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function editEmployeeGroup(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/EmployeeGroup?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createEmployeeGroup(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/EmployeeGroup`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getEmployeeGroupId(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EmployeeGroup?$filter=EmployeeGroupId eq ${id}&$expand=LastModifiedUser,EmployeeGroupEntries($expand=Employee;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}



export function getEmployeeList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Employee?$select=EmployeeId,EmployeeName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}