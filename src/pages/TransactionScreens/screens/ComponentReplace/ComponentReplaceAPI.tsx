import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getroutecardlist() {
  const accessToken = getSessionToken();
  const body = {};
  return api.post(`svc/ComponentReplaceService/BindRouteCards`, body, {
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

export function getUOMNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/UOM?$select=UOMId,UOMName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getReplaceReasonNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/ComponentReplaceReasons`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getSubstituteReasonNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/SubstituteReason`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function postGetComponentReplaceMaterialList(params) {
  const accessToken = getSessionToken();
  return api.post(
    "svc/ComponentReplaceService/BindComponentIssuedMaterials",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function postScanComponentRouteCard(params) {
  const accessToken = getSessionToken();
  return api.post(
    "svc/ComponentReplaceService/ValidateComponentRoutecard",
    params,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function postComponentReplaceSave(params) {
  const accessToken = getSessionToken();

  return api.post("svc/ComponentReplaceService/ComponentReplace", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
