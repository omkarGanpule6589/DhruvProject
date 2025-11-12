import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEquipmentStatusCodeList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/EquipmentStatusCode?$select=EquipmentStatusCodeId,EquipmentStatusCode1,LastModifiedUserId,Description,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

}

export function getEquipmentStatusById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/EquipmentStatusCode?$filter=EquipmentStatusCodeId eq ${id}&$select=EquipmentStatusCodeId,EquipmentStatusCode1,Description,LastModifiedDateTime&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editEquipmentStatusCode(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/EquipmentStatusCode?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateEquipmentStatusCode(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/EquipmentStatusCode", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}