import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getComponentDefectReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ComponentDefectReasonGroup?$select=ComponentDefectReasonGroupId,ComponentDefectReasonGroupName,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getComponentDefectReasonGroupFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ComponentDefectReasonGroup?$filter=ComponentDefectReasonGroupId eq ${id}&$select=ComponentDefectReasonGroupName,Description,LastModifiedDateTime&$expand=LastModifiedUser,CompDefectReasonGroupEntries($expand=ComponentDefectReason;$filter=IsDeleted ne true)`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function EditComponentDefectReasonGroupdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ComponentDefectReasonGroup?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateComponentDefectReasonGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ComponentDefectReasonGroup", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}