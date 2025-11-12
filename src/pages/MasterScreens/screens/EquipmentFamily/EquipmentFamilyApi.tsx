import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEquipmentFamilyList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentFamily?$select=EquipmentFamilyId,EquipmentFamilyName,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getEquipmentFamilyById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentFamily?$filter=EquipmentFamilyId eq ${id}&$expand=LastModifiedUser,EquipmentStatusModel,uom,EmailNotificationGroup&$select=EquipmentFamilyName,Description,EquipmentStatusModelId,EmailNotificationGroupId,Uomid,LastModifiedDateTime`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editEquipmentFamily(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/EquipmentFamily?key=${id}`, reqObj,
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

export function getEmailNotificationNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EmailNotification?$select=EmailNotificationId,EmailNotification1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getUomNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/UOM?$select=Uomid,Uomname`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateEquipmentFamily(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/EquipmentFamily", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
