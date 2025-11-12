import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function getallMainRequirementList() {
  const accessToken = getSessionToken();
  return api.get(`odata/DateRequirement`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getallMainRequirementReccuringList() {
  const accessToken = getSessionToken();
  return api.get(`odata/RecurringDateRequirement`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getallMainRequirementThruputreqList() {
  const accessToken = getSessionToken();
  return api.get(`odata/ThruputRequirement`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getallMaintenanceClassList() {
  const accessToken = getSessionToken();
  return api.get(`odata/MaintenanceGroup`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getQtyEquipmentGroupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/EquipmentGroup`,
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



export function MaintenanceReqActivationService(params) {
  const accessToken = getSessionToken();
  return api.post("svc/MaintenanceReqActivationService/MaintenanceReqActivated", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}