import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getShippingReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ShippingReason?$select=ShippingReasonId,ShippingReasonName,Description,CreatedDateTime&$expand=CreatedUser
`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getShippingReasondetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/ShippingReason?$filter=ShippingReasonId eq ${id}&$select=ShippingReasonName,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function UpdateShippingReason(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ShippingReason?key=${id}`, params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateShippingReason( params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ShippingReason", params,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}