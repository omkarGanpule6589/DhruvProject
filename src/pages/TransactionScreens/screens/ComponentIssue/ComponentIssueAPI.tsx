import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getComponentIssueByfilter(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Routecard?$filter=RouteCardId eq ${id}&$expand=Product,ProductionOrder,StartFactory,Uom,CurrentStatus($expand=OperationDetail,ProcessflowStep($expand=Processflow))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getRoutecardList() {
  const accessToken = getSessionToken();
  const body = {};
  return api.post(`svc/ComponentIssueService/BindRouteCards`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getRoutecardIdbyName(params) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/RouteCard?$filter=RouteCardName eq '${params}'&$select=RouteCardId`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getOperationlist() {
  const accessToken = getSessionToken();
  return api.get(`odata/Operation`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getIssueDifferenceReason() {
  const accessToken = getSessionToken();
  return api.get(`odata/IssueDifferenceReason`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getSubstituteReason() {
  const accessToken = getSessionToken();
  return api.get(`odata/SubstituteReason`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getComponentIssueCode() {
  const accessToken = getSessionToken();
  return api.get(`odata/ComponentIssueCode`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getLoadMaterialGrid(reqObj) {
  const accessToken = getSessionToken();
  return api.post(
    "svc/ComponentIssueService/BindComponentIssueMaterials",
    reqObj,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getScanComponentRouteCard(reqObj) {
  const accessToken = getSessionToken();
  return api.post(
    "svc/ComponentIssueService/ValidateComponentRoutecard",
    reqObj,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function postcomponentIssue(params) {
  const accessToken = getSessionToken();

  return api.post("svc/ComponentIssueService/ComponentIssue", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

