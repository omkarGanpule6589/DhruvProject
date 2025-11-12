import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getRemovalDifferenceReasonList() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/RemoveDifferenceReason?$select=RemoveDifferenceReasonId,RemoveDifferenceReasonName,Description,LastModifiedUserId,CreatedDateTime&$expand=CreatedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getRemoveDifferenceReasonById(id) {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/RemoveDifferenceReason?$filter=RemoveDifferenceReasonId eq ${id}&$select=RemoveDifferenceReasonId,RemoveDifferenceReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editReleaseReason(id, reqObj) {
  const accessToken = getSessionToken();

  return api.patch(`/odata/ReleaseReason?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function editRemovalReason(id, reqObj) {
  const accessToken = getSessionToken();

  return api.patch(`/odata/RemoveDifferenceReason?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateRemovalReason(reqObj) {
  const accessToken = getSessionToken();

  return api.post(`/odata/RemoveDifferenceReason`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
