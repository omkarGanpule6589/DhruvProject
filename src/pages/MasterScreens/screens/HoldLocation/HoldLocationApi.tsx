import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getHoldLocationList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/HoldLocation?$select=HoldLocationId,HoldLocation1,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getHoldLocationDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/HoldLocation?$filter=HoldLocationId eq ${id}&$select=HoldLocation1,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
  
}
export function EditHoldLocationdetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/HoldLocation?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateHoldLocation(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/HoldLocation", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}