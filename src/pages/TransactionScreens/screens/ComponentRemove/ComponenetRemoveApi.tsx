import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getroutecardlist() {
  const accessToken = getSessionToken();
  const body = {};
  return api.post(`svc/ComponentRemoveService/BindRouteCards`, body, {
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
export function getRemovedifferencereason() {
  const accessToken = getSessionToken();
  return api.get("odata/RemoveDifferenceReason", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getComponentRemovalReason() {
  const accessToken = getSessionToken();
  return api.get("odata/ComponentRemovalReason", {
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

export function postComponentRemove(params) {
  const accessToken = getSessionToken();
  return api.post("svc/ComponentRemoveService/ComponentRemove", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function PostRoutecardDatagrid(params) {
  const accessToken = getSessionToken();

  return api.post(
    "svc/ComponentRemoveService/BindComponentRemoveMaterials",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
