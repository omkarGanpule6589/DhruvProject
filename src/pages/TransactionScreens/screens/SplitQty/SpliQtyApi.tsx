import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getroutecardlist() {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);
  return api.get(
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=ChildCount eq 0 and Status ne 2 and ParentRouteCardId eq null and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
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

export function postSplitQtySave(params) {
  const accessToken = getSessionToken();
  return api.post("svc/SplitQtyService/SplitQty", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getOperationlist() {
  const accessToken = getSessionToken();
  return api.get(`odata/Operation`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getSplitQtyTabout(params) {
  const accessToken = getSessionToken();
  return api.post("svc/SplitQtyService/SplitQtyValidation", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
