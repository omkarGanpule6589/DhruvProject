import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getStartReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/StartReason?$select=StartReasonId,StartReasonName,Description,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getStartReasondetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/StartReason?$filter=StartReasonId eq ${id}&$select=StartReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function UpdateStartReason(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/StartReason?key=${id}`, params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateStartReason( params) {
  const accessToken = getSessionToken();
  return api.post("/odata/StartReason", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}