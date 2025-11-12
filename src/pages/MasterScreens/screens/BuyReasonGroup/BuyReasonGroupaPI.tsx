import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getBuyReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/BuyReasonGroup?$select=BuyReasonGroupId,BuyReasonGroupName,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getBuyReasonGroupdetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/BuyReasonGroup?$filter=BuyReasonGroupId eq ${id}&$select=BuyReasonGroupId,BuyReasonGroupName,Description,LastModifiedDateTime&$expand=LastModifiedUser,BuyReasonGroupEntries($expand=BuyReason;$filter=IsDeleted ne true)`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function EditBuyReasonGroupdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/BuyReasonGroup?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateBuyReasonGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/BuyReasonGroup", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getBuyReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `odata/BuyReason?$select=BuyReasonId,BuyReasonName,Description`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getBuyReasonGroupdetailsFetchForEntries(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/BuyReasonGroup?$filter=BuyReasonGroupId eq ${id}&$expand=BuyReasonGroupEntries($expand=BuyReason)`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
}