import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getDigiTaskList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DigiTask?$select=DigiTaskId,DigiTaskName,Revision,Description,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getDigitaskById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DigiTask?$filter=DigiTaskId eq ${id}&$select=DigiTaskName,Revision,DigiTaskRoot,ActiveRevision,IsActive,Description,ExecutionMode,LastModifiedDateTime&$expand=LastModifiedUser,DigiTaskLists($expand=ActionList;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editDigitask(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/DigiTask?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getDigitaskByIdRevision(name, revision) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/DigiTask?$filter=DigiTaskName eq ${name} and  Revision eq ${revision}&select=DigiTaskId,DigiTaskName,Revision`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function CreateDigiTask(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/DigiTask", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getActionListList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ActionList`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
