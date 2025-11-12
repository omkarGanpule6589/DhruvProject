import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getSellReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/SellReason?$select=SellReasonId,SellReasonName,Description,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function GetSellReasondetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/SellReason?$filter=SellReasonId eq ${id}&$select=SellReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function UpdateSellReason(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/SellReason?key=${id}`, params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateSellReason( params) {
  const accessToken = getSessionToken();
  return api.post("/odata/SellReason", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}