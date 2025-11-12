import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getQtyEquipmentGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentGroup?$select=EquipmentGroupId,EquipmentGroupName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getEquipmentGroupDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentGroup?$filter=EquipmentGroupId eq ${id}&$expand=LastModifiedUser,EquipmentGroupEntries($expand=Equipment;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function EditEquipmentGroupDetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/EquipmentGroup?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateEquipmentGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/EquipmentGroup", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getEquipmentList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Equipment`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
