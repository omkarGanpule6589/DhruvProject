import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function getroutecardlist() {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);
  return api.get(
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=Status ne 2 and Status ne 3 and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getHoldreasonlist() {
  const accessToken = getSessionToken();
  return api.get(`odata/Holdreason`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getRoutecardIdbyfilter(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Routecard?$filter=RouteCardId eq ${id}&$expand=Product,HoldReason,ProductionOrder,StartFactory,StartReason,Uom,UnitLevel,CurrentStatus($expand=OperationDetail,Equipment,ProcessflowStep($expand=Processflow))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function postHold(params) {
  const accessToken = getSessionToken();
  return api.post("svc/HoldService/Hold", params, {
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

export function GetHoldtabout(params) {
  const accessToken = getSessionToken();
  return api.post("svc/HoldService/HoldTab", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
