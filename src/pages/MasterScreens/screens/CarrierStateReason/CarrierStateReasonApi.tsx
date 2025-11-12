import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getCarrierStateReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/CarrierStateReason?$select=CarrierStateReasonId,CarrierStateReasonName,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getCarrierStateReasonById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/CarrierStateReason?$filter=CarrierStateReasonId eq ${id}&$select=CarrierStateReasonId,CarrierStateReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editCarrierStateReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/CarrierStateReason?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createCarrierStateReason(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/CarrierStateReason`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}