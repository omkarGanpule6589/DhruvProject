import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getUomList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/UOM?$select=Uomid,Uomname,Description,CreatedDateTime&$expand=CreatedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getUomById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/UOM?$filter=Uomid eq ${id}&$select=Uomname,Description,LastModifiedDateTime&$expand=LastModifiedUser`,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editUom(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/UOM?key=${id}`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createUom(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/UOM`, reqObj,{
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}