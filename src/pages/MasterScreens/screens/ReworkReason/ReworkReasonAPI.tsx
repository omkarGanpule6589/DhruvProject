import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getReworkReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ReworkReason?$select=ReworkReasonId,ReworkReasonName,Description,CreatedDateTime&$expand=CreatedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getReworkReasonById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ReworkReason?$filter=ReworkReasonId eq ${id}&$select=ReworkReasonId,ReworkReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function editReworkReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ReworkReason?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createReworkReason(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/ReworkReason`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
