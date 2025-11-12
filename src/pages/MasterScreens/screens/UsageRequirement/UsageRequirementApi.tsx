import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getUsageRequirementList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/UsageRequirement?$select=UsageRequirementId,UsageRequirement1,Description,revision,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getUsagRequirementById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/UsageRequirement?$filter=UsageRequirementId eq ${id}&$expand=UsageReqCheckLists($expand=EmployeeGroup,DataCollectionDef,UsageReq;$filter=IsDeleted ne true),MaintenanceReason,DocumentGroup,DataCollection,EmailNotification,Bom,LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getMaintenanceReasonList() {
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
export function getDocumentList() {
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
export function getDataCollectionList() {
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
export function UpdateUsageRequirementdetails(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/UsageRequirement?key=${id}`, params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createUsageRequirement(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/UsageRequirement`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
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
