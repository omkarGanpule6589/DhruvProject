import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getLossReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/LossReason?$select=LossReasonId,LossReasonName,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getLossReasondetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/LossReason?$filter=LossReasonId eq ${id}&$select=LossReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function editLossReasondetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/LossReason?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateLossReasondetails(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/LossReason", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
