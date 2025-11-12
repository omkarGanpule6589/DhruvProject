import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getBonusReasonById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/BonusReason?$filter=GainReasonId eq ${id}&$select=GainReasonId,GainReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editBonusReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/BonusReason?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createBonusReason(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/BonusReason`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getBonusReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `odata/BonusReason?$select=GainReasonId,GainReasonName,Description,CreatedDateTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
