import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getThruputRequirementList() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/ThruputRequirement?$Select=ThruputRequirementId,ActiveRevision,ThruputRequirement1,Revision,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getThruputRequirementById(id) {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/ThruputRequirement?$filter=ThruputRequirementId eq ${id}&$expand=LastModifiedUser,ThruputReqCheckLists($expand=EmployeeGroup,DataCollectionDef;$filter=IsDeleted ne true),MaintenanceReason,Uom,DocumentGroup,DataCollection,Bom,EmailNotification`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function UpdateThruputRequirement(id, params) {
  const accessToken = getSessionToken();

  return api.patch(`/odata/ThruputRequirement?key=${id}`, params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createThruputRequirement(reqObj) {
  const accessToken = getSessionToken();

  return api.post(`/odata/ThruputRequirement`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getMaintenanceReasonNames() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/MaintenanceReason?$select=MaintenanceReasonId,MaintenanceReason1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getDocumentGroupNames() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/DocumentGroup?$select=DocumentGroupId,DocumentGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getDataCollectionNames() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/DataCollectionDef?$select=DataCollectionDefId,DataCollectionName,IsActive`,
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

export function getBomNames() {
  const accessToken = getSessionToken();

  return api.get(`/odata/Bom?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getUomNames() {
  const accessToken = getSessionToken();

  return api.get(`/odata/UOM?$select=Uomid,Uomname`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getEmployeeGroupNames() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/EmployeeGroup?$select=EmployeeGroupId,EmployeeGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function odatabatch(body) {
  const accessToken = getSessionToken();

  return api.post(`odata/$batch`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
