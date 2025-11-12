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

export function getEquipmentlist() {
  const accessToken = getSessionToken();
  return api.get(`odata/Equipment`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
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
export function postMoveNonStd(params) {
  const accessToken = getSessionToken();
  return api.post("svc/MoveNonStdService/MoveNonStd", params, {
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
export function getProcessflowlist() {
  const accessToken = getSessionToken();
  return api.get(`odata/ProcessFlow`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProcessflowsteplist(id) {
  const accessToken = getSessionToken();
  return api.get(`odata/ProcessflowStep?$filter=ProcessflowId eq ${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function GetMovenonStdtabout(params) {
  const accessToken = getSessionToken();
  return api.post("svc/MoveNonStdService/RouteCardValidate", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
