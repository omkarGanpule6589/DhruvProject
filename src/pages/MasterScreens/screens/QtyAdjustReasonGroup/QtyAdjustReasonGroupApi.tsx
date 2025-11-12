import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getQtyAdjustReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/QtyAdjustReasonGroup?$select=QtyAdjustReasonGroupId,QtyAdjustReasonGroupName,Description,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getQtyAdjustReasonGroupDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/QtyAdjustReasonGroup?$filter=QtyAdjustReasonGroupId eq ${id}&$select=QtyAdjustReasonGroupName,Description,LastModifiedDateTime&$expand=QtyAdjustReasonGroupEntries($expand=QtyAdjustReason;$filter=IsDeleted ne true)&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function EditQtyAdjustReasonGroupsDetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/QtyAdjustReasonGroup?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateQtyAdjustReasonGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/QtyAdjustReasonGroup", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getQtyAdjustReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/QtyAdjustReason`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}