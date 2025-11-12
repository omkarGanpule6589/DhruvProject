import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getSubstituteReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SubstituteReason?$select=SubstituteReasonId,SubstituteReasonName,Description,CreatedDateTime&$expand=CreatedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function UpdateSubstituteReason(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/SubstituteReason?key=${id}`, params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateSubstituteReason(params) {
  const accessToken = getSessionToken();
  return api.post(`/odata/SubstituteReason`, params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getSubstituteReasonbyid(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/SubstituteReason?$filter=SubstituteReasonId eq ${id}&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
