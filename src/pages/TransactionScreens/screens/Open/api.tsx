import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getroutecardlist() {
  const accessToken = getSessionToken();
  const body = {};
  return api.post(`svc/OpenService/BindRoutecards`, body, {
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
  return api.get(`odata/Operation`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function postOpen(params) {
  const accessToken = getSessionToken();

  return api.post("svc/OpenService/Open", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getopentabout(params) {
  const accessToken = getSessionToken();

  return api.post("/svc/OpenService/OpenTab", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
