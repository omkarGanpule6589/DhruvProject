import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEquipmentTypeList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentType?$select=EquipmentTypeId,EquipmentType1,Description,CreatedDateTime&$expand=*`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getEquipmentTypeById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentType?$filter=EquipmentTypeId eq ${id}&$select=EquipmentType1,Description,EquipmentStatusModelId,LastModifiedDateTime&$expand=EquipmentStatusModel,LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editEquipmentType(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/EquipmentType?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getEquipmentStatusModelNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentStatusModel?$select=EquipmentStatusModelId,EquipmentStatusModelName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function CreateEquipmentType(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/EquipmentType", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
