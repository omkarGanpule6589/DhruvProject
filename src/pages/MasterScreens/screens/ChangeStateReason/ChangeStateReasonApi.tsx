import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getChangeStateReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ChangeStateReason?$select=ChangeStateReasonId,ChangeStateReasonName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getChangeStateReasonById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ChangeStateReason?$filter=ChangeStateReasonId eq ${id}&$select=ChangeStateReasonId,ChangeStateReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editChangeStateReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ChangeStateReason?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateChangeStateReason(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ChangeStateReason", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
