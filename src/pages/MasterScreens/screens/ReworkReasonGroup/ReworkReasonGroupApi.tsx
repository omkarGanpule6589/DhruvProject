import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getReworkReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ReworkReasonGroup?$select=ReworkReasonGroupId,ReworkReasonGroupName,Description,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getReworkReasonGroupDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ReworkReasonGroup?$filter=ReworkReasonGroupId eq ${id}&$select=ReworkReasonGroupName,Description,LastModifiedDateTime&$expand=LastModifiedUser,ReworkReasonGroupEntries($expand=ReworkReason;$filter=IsDeleted ne true)`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function EditReworkReasonGroupDetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ReworkReasonGroup?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateReworkReasonGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ReworkReasonGroup", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getReworkReason() {
  const accessToken = getSessionToken();
  return api.get(`/odata/reworkreason`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}