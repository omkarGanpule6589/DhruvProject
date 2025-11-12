import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getBuyReasonById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/BuyReason?$filter=BuyReasonId eq ${id}&$select=BuyReasonId,BuyReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editBuyReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/BuyReason?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateBuyReason(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/BuyReason", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getBuyReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `odata/BuyReason?$select=BuyReasonId,BuyReasonName,Description,CreatedDateTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
