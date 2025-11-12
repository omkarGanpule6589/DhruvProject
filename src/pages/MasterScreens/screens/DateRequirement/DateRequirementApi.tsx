import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getDateRequirementList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DateRequirement?$select=DateRequirementId,DateRequirementName,Description,Revision,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getDateReqById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DateRequirement?$filter=DateRequirementId eq ${id}&$expand=LastModifiedUser,MaintenanceReason,DocumentGroup,DataCollection,Bom,EmailNotification&$expand=DateReqCheckLists($expand=DataCollectionDef,EmployeeGroup;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editDateReq(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/DateRequirement?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createDateRequirement(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/DateRequirement`, reqObj, {
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

export function getDateReqCheckListsId(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DateRequirement?$filter=DateRequirementId eq ${id}&$expand=DateReqCheckLists($expand=*)`,
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

export function getDateReqNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DateRequirement?$select=DateRequirementId,DateRequirementName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

// export function odatabatch(body) {
//   return api.post(`odata/$batch`, body);
// }
