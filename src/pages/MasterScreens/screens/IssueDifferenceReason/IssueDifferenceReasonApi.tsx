import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getIssueDiffList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/IssueDifferenceReason?$select=IssueDifferenceReasonId,IssueDifferenceReasonName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getIssueDifferenceReasonDetails(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/IssueDifferenceReason?$filter=IssueDifferenceReasonId eq ${id}&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function editIssueDifferenceReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/IssueDifferenceReason?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

}
export function CreateIssueDifferenceReason(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/IssueDifferenceReason", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
