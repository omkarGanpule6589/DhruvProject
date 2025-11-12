import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getroutecardlist() {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);
  return api.get(
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=Status ne 2 and ChildCount gt 0 and ParentRouteCardId eq null and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getChildroutecardlist() {
  const accessToken = getSessionToken();
  return api.get(`odata/Routecard?$select=RouteCardId,RouteCardName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getRoutecardIdbyfilter(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Routecard?$filter=RouteCardId eq ${id}&$expand=Product,HoldReason,ProductionOrder,StartFactory,StartReason,Uom,UnitLevel,CurrentStatus($expand=OperationDetail,ProcessflowStep($expand=Processflow))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getOperationlist() {
  const accessToken = getSessionToken();
  return api.get(`odata/Operation`);
}

export function postScanToRouteCard(params) {
  const accessToken = getSessionToken();

  return api.post("svc/SplitRouteCardService/SplitRouteCardGrid", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getUnitLevellist() {
  const accessToken = getSessionToken();
  return api.get(`odata/UnitLevel?$select=UnitLevel1,UnitLevelId`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function postSplitRouteCardSave(params) {
  const accessToken = getSessionToken();

  return api.post("svc/SplitRouteCardService/SplitRouteCard  ", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
