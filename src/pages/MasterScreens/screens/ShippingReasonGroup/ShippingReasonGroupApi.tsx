import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getShippingReasonGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ShippingReasonGroup?$select=ShippingReasonGroupId,ShippingReasonGroupName,Description,CreatedDateTime&$expand=CreatedUser`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getShippingReasonGroupdetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ShippingReasonGroup?$filter=ShippingReasonGroupId eq ${id}&$expand=LastModifiedUser,ShippingReasonGroupEntries($expand=ShippingReason;$filter=IsDeleted ne true)`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function UpdateShippingReasonGroup(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ShippingReasonGroup?key=${id}`, params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateShippingReasonGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ShippingReasonGroup", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
