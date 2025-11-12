import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getProcessFlowList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Processflow?$select=ProcessflowId,ProcessflowName,ProcessflowRevision,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getProcessFlowById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Processflow?$filter=ProcessflowId eq ${id}&$select=ProcessflowId,ProcessflowName,ProcessflowRevision,ProcessflowRoot,LastModifiedUserId,IsActive,ActiveRevision,LastModifiedDateTime&$expand=ProcessflowSteps($expand=OperationDetail,AlternateStepDetailAlternateSteps($expand=ProcessflowStep),ReworkStepDetailReworkSteps($expand=ProcessflowStep);$filter=IsDeleted ne true)&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editProcessFlow(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Processflow?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createProcessFlows(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/Processflow`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getUomNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/OperationDetail?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getproflowstep() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ProcessflowStep`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function finalsave(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`svc/ProcessflowRevisionService/SaveProcessflow`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
