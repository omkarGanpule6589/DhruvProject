import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getCombineQtyByfilter(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Routecard?$filter=RouteCardId eq ${id}&$expand=Product,ProductionOrder,StartFactory,Uom,CurrentStatus($expand=OperationDetail,Equipment,ProcessflowStep($expand=Processflow))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getRoutecardList() {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);
  return api.get(
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=Status ne 2 and Status ne 3 and ChildCount eq 0 and ParentRouteCardId eq null and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`,
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

export function getScanCombineQtyGrid(reqObj) {
  const accessToken = getSessionToken();

  return api.post("svc/CombineQtyService/GridToCombineQty", reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function PostCombineQty(reqObj) {
  const accessToken = getSessionToken();

  return api.post("svc/CombineQtyService/CombineQty", reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
