import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEquipmentStatusModelList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentStatusModel?$select=EquipmentStatusModelId,EquipmentStatusModelName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getEquipmentStatusModeldetailsFetch(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentStatusModel?$filter=EquipmentStatusModelId eq ${id}&$select=EquipmentStatusModelId,EquipmentStatusModelName,Description,LastModifiedDateTime&$expand=LastModifiedUser,EquipmentStatusModelDetails($expand=EquipmentStatusCodeNavigation,ToEquipmentStatusCodeNavigation;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
}

export function UpdateEquipmentStatusModel(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/EquipmentStatusModel?key=${id}`, params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateEquipmentStatusModel(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/EquipmentStatusModel", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getEqpStatusCode() {
  const accessToken = getSessionToken();
  return api.get(`/odata/EquipmentStatusCode`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
