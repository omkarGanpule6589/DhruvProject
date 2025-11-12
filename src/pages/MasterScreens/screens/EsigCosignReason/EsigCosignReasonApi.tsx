import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEsigCosignReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/SecondAuthenticationCosignReason?$select=SecondAuthenticationCosignReasonId,SecondAuthenticationCosignReason1,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getEsigCosignReasonById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/SecondAuthenticationCosignReason?$filter=SecondAuthenticationCosignReasonId eq ${id}&$select=SecondAuthenticationCosignReason1,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editEsigCosignReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/SecondAuthenticationCosignReason?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createEsigCosignReason(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/SecondAuthenticationCosignReason`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}