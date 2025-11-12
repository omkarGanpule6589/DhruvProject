import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getActionListList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ActionList?$Select=ActionListId,ActionListName,Description,CreatedDateTime,ActionListRevision,ActiveRevision&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getActionListDetails(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/ActionList?$filter=ActionListId eq  ${id}&$expand=LastModifiedUser,ActionItems($expand=SecondAuthentication,trainingReq,ActionType;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editActionDetails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ActionList?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateActionList(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ActionList", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getTXn() {
  const accessToken = getSessionToken();
  return api.get(`/odata/TransactionData?$select=Id,Name`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
