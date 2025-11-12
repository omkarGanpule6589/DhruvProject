import { api, GKBapi } from "../../../../components/API/apiConfig";
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
export function FocovisionMachinelist() {
  const accessToken = getSessionToken();
  return api.get(`odata/FocovisionMachine`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getEquipmentlistfromop(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/operation?$filter=OperationId eq ${id}&$expand=EquipmentGroup($expand=EquipmentGroupEntries($filter=IsDeleted ne true;$expand=Equipment))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getDegectCodeGroupId(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/operation?$filter=OperationId eq ${id}&$expand=DefectReasonGoup`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getDegectCodeGroupId1(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/operation?$filter=OperationId eq ${id}&$expand=DefectReasonGoup,LossReasonGroup($expand=LossReasonGroupEntries($expand=Lossreason;$filter=IsDeleted eq false))`,
    {
    //  ,DefectCodeGroupEntries($expand=DefectCode;$filter=IsDeleted ne true
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
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
export function postMove(params) {
  const accessToken = getSessionToken();
  return api.post("svc/MoveService/Move", params, {
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
export function gettostep(params) {
  const accessToken = getSessionToken();
  return api.post("svc/MoveService/MoveTxnToGetNextSteps", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getDefectCodeGroupDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/DefectCodeGroup?$filter=DefectCodeGroupId eq ${id}&$expand=LastModifiedUser,DefectCodeGroupEntries($expand=DefectCode;$filter=IsDeleted ne true)`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  
}

export function getGKBProductById(ItemCode) {
  const accessToken = getSessionToken();
  const encodedLensType = encodeURIComponent(ItemCode);
  return api.get(
    `odata/ProductMaster?$filter=ItemCode eq '${encodedLensType}'&$expand=ItemTypeCategory,ItemType,ItemClass,Material,CoatingGP,LensIndex,Photo,LensColor,LensSide,CustomerOpcs($expand=customer)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getProcessFlowById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Processflow?$filter=ProcessflowId eq ${id}&$select=ProcessflowId,ProcessflowName,ProcessflowRevision,ProcessflowRoot,LastModifiedUserId,IsActive,ActiveRevision,LastModifiedDateTime&$expand=ProcessflowSteps($expand=OperationDetail,AlternateStepDetailAlternateSteps($expand=ProcessflowStep),ReworkStepDetailReworkSteps($expand=ProcessflowStep);$filter=IsDeleted ne true)&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getroutesonorder(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Routecard?$filter=ProductionOrderId eq ${id} and RoutecardType eq 'PRC'&$expand=Product`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getBtnDetailsValidation(params) {
  const accessToken = getSessionToken();
  return api.post("svc/MoveService/ButtonRouteCardTabOut", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}


export function ButtonRouteCardsStockReport(params) {
  const accessToken = getSessionToken();
  return api.post("svc/ButtonStartService/ButtonRouteCardsStockReport", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}


export function getTestAndTrialDetailsIdbyRCID(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/TestTrialHistory?$filter=RouteCardId eq  ${id} and TestTrialReason/IsDeleted ne true&$expand=TestTrialReason`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}


export function GetRcDetails(params) {
  const accessToken = getSessionToken();
  return api.post("svc/RouteCardTabOutSevice/RouteCardTabOut", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getroutecardlistPaginated1(skip = 0, top = 10, filter = "", order = "") {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);

  let baseUrl = `odata/Routecard?$count=true&$select=RouteCardName,RouteCardId&$filter=Status ne 2 and Status ne 3 and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`;

  if (filter) baseUrl += ` and ${filter}`;
  if (order) baseUrl += `&$orderby=${order}`;

  baseUrl += `&$skip=${skip}&$top=${top}`;

  return api.get(baseUrl, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getroutecardlistPaginated(skip = 0, top = 10, filter = "", order = "") {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);

  let baseFilter = `Status ne 2 and Status ne 3 and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`;

  if (filter) {
    baseFilter += ` and ${filter}`;
  }

  const encodedFilter = encodeURIComponent(baseFilter);
  let url = `odata/Routecard?$count=true&$select=RouteCardName,RouteCardId&$filter=${encodedFilter}`;

  if (order) url += `&$orderby=${order}`;
  url += `&$skip=${skip}&$top=${top}`;

  console.log("📡 Fetch URL:", url);
  return api.get(url, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}
