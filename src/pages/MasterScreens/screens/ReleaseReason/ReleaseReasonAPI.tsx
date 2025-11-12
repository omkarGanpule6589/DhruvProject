import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getRelaseReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ReleaseReason?$select=ReleaseReasonId,ReleaseReasonName,Description,LastModifiedUserId,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getReleaseReasonById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ReleaseReason?$filter=ReleaseReasonId eq ${id}&$select=ReleaseReasonId,ReleaseReasonName,Description,LastModifiedUserId,LastModifiedDateTime&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function editReleaseReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ReleaseReason?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createReleaseReason(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/ReleaseReason`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}