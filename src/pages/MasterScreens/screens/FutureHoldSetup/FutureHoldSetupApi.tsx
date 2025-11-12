import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getFutureHoldSetupList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/FutureHoldSetup?$select=FutureHoldSetupId,FutureHoldSetup1,Description,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getFutureHoldSetupDetails(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/FutureHoldSetup?$filter=FutureHoldSetupId eq ${id}&$expand=LastModifiedUser,FutureHoldDetails($expand=Operation,OperationDetail,ProductionOrder,HoldReason,EmailNotificationGroup,HoldLocation,product;$filter=IsDeleted ne true),FutureHoldLotLists($filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editFutureHoldSetup(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/FutureHoldSetup?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateFutureHoldSetup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/FutureHoldSetup", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getOperationNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Operation?$select=OperationId,OperationName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getOperationDetailNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/OperationDetail?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getProductNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Product?$filter=State ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProductionOrderNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductionOrder?$select=ProductionOrderId,ProductionOrderName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getHoldReasonNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/HoldReason?$select=HoldReasonId,HoldReasonName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
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
export function getHoldLocationNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/HoldLocation?$select=HoldLocationId,HoldLocation1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getRoutrcardNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/RouteCard?$select=RouteCardId,RouteCardName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
