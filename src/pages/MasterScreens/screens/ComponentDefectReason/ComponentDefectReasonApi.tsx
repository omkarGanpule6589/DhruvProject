import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getComponentDefectReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ComponentDefectReason?$select=ComponentDefectReasonId,ComponentDefectReasonName,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getComponentDefectReasondetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ComponentDefectReason?$filter=ComponentDefectReasonId eq ${id}&$select=ComponentDefectReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
}
export function EditComponentDefectReasondetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ComponentDefectReason?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateComponentDefectReason(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ComponentDefectReason", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}