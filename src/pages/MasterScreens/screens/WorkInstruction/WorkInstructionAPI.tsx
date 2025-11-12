import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getWorkInstructionList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/WorkInstruction?$select=WorkInstructionId,WorkInstructionName,Description,MoveInInstruction,MoveOutInstruction,ProductId,OperationId,ProductId,DepartmentId,LastModifiedUserId,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getWorkInstructionById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/WorkInstruction?$filter=WorkInstructionId eq ${id}&$expand=Operation,Department,Product,LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function editWorkInstruction(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/WorkInstruction?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createWorkInstruction(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/WorkInstruction`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getOperationList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Operation?$select=OperationId,OperationName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProductList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Product?$filter=State ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getDepartmentList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Department?$select=DepartmentId,DepartmentName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
