import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getroutecardlist() {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);
  return api.get(
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=Status ne 2 and Status ne 3 and ChildCount eq 0 and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)&$count=true`,
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
    `odata/Routecard?$filter=RouteCardId eq ${id}&$expand=Product($expand=Processflow),HoldReason,ProductionOrder,StartFactory,StartReason,Uom,UnitLevel,CurrentStatus($expand=OperationDetail,Equipment,ProcessflowStep($expand=Processflow))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function postChangeQty(params) {
  const accessToken = getSessionToken();
  return api.post("svc/ChangeQtyService/ChangeQty", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getReasonlist(name) {
  const accessToken = getSessionToken();
  return api.get(`odata/${name}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function reasonbyopgroup(id) {
  const accessToken = getSessionToken();
  return api.get(`odata/Operation?$filter=OperationId eq ${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getChangeQtytabout(params) {
  const accessToken = getSessionToken();
  return api.post("svc/ChangeQtyService/ChangeQtyValidate", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
