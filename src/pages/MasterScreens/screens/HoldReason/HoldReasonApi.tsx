import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getHoldReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/HoldReason?$select=HoldReasonId,HoldReasonName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getHoldReasonDetails(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/HoldReason?$filter=HoldReasonId eq ${id}&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editHoldReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/HoldReason?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateHoldReason(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/HoldReason", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
