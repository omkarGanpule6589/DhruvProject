import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getMaintenanceClassList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/MaintenanceGroup?$select=MaintenanceGroupName,MaintenanceGroupId,CreatedDateTime&$expand=CreatedUser`,
  {
    //  return api.get(`/odata/MaintenanceClass?$select=MaintenanceClassId,MaintenanceClass1,Description,CreatedDateTime&$expand=CreatedUser
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getMaintenanceClassdetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/MaintenanceGroup?$filter=MaintenanceGroupId eq ${id}&$select=MaintenanceGroupName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }); 
}

export function editMaintenanceClassdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/MaintenanceGroup?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateMaintenanceClassdetails(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/MaintenanceGroup", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}