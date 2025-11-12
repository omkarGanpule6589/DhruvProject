import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getMaintenanceReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/MaintenanceReason?$select=MaintenanceReasonId,MaintenanceReason1,Description,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function ggetMaintenanceReasondetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/MaintenanceReason?$filter=MaintenanceReasonId eq ${id}&$select=MaintenanceReason1,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function editMaintenanceReasondetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/MaintenanceReason?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateMaintenanceReasondetails(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/MaintenanceReason", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
 

