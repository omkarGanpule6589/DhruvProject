import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getEquipmentName() {
  const accessToken = getSessionToken();
  return api.get("odata/Equipment?$select=EquipmentId,EquipmentName", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getroutecardlist() {
  const accessToken = getSessionToken();
  const body = {};
  return api.post(`svc/ReworkService/BindRoutecards`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getReworkReasonName() {
  const accessToken = getSessionToken();
  return api.get("odata/ReworkReason?$select=ReworkReasonName", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getReworkStepDetail() {
  const accessToken = getSessionToken();
  return api.get("odata/ReworkStepDetail?$select=ProcessflowStepId", {
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
export function getreworkstepbyprostepid(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Reworkstepdetail?$expand=ReworkStep&$filter=ProcessflowStepId eq ${id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function postRework(params) {
  const accessToken = getSessionToken();
  return api.post("svc/ReworkService/Rework", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function GetReworktabout(params) {
  const accessToken = getSessionToken();
  return api.post("svc/ReworkService/RouteCardValidate", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
