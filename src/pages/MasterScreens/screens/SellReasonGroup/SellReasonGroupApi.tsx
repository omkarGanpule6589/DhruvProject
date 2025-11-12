import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getSellReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/SellReasonGroup?$select=SellReasonGroupId,SellReasonGroupName,Description,CreatedDateTime&$expand=CreatedUser
`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function GetSellReasonGroupdetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/SellReasonGroup?$filter=SellReasonGroupId eq ${id}&$select=SellReasonGroupName,Description,LastModifiedDateTime&$expand=LastModifiedUser,SellReasonGroupEntries($expand=SellReason;$filter=IsDeleted ne true)`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function UpdateSellReasonGroup(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/SellReasonGroup?key=${id}`, params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateSellReasonGroup( params) {
  const accessToken = getSessionToken();
  return api.post("/odata/SellReasonGroup", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getSellReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/SellReason`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}