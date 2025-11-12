import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getRecurringDateList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/RecurringDateRequirement?$select=RecurringDateRequirementId,RecurringDateRequirement1,Revision,Description,RecurringDatePattern,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getRecurringDateById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/RecurringDateRequirement?$filter=RecurringDateRequirementId eq ${id}&$expand=RecurringDateReqCheckLists($expand=EmployeeGroup,DataCollectionDef;$filter=IsDeleted ne true),MaintenanceReason,DocumentGroup,DataCollection,EmailNotification,Bom,LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editRecurringDateReq(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/RecurringDateRequirement?key=${id}`, reqObj, {
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

export function CreateRecurringDateRequirement(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/RecurringDateRequirement", params, {
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
