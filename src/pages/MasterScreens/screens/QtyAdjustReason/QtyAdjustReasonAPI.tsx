import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getQtyReasonList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/QtyAdjustReason?$select=QtyAdjustReasonId,QtyAdjustReasonName,LastModifiedUserId,Description,CreatedDateTime&$expand=CreatedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getQtyReasonById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/QtyAdjustReason?$filter=QtyAdjustReasonId eq ${id}&$select=QtyAdjustReasonId,QtyAdjustReasonName,Description,LastModifiedUserId,LastModifiedDateTime&$expand=LastModifiedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function editQtyAdjustReason(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/QtyAdjustReason?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateAdjustReason(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/QtyAdjustReason", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
