import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getCombineRoutCardByfilter(id) {
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
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=Status ne 2 and Status ne 3 and ParentRouteCardId eq null and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`,
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
export function getScanCombineRouteCradGrid(reqObj) {
  const accessToken = getSessionToken();

  return api.post("svc/CombineRouteCardService/GridCombine", reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function PostCombineRouteCard(reqObj) {
  const accessToken = getSessionToken();

  return api.post("svc/CombineRouteCardService/CombineRouteCard", reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}


export function getRoutecardListPaginated(skip = 0, top = 10, filter = "", order = "") {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);

  // Base filter from the original non-paginated function
  let baseFilter = `Status ne 2 and Status ne 3 and ParentRouteCardId eq null and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`;

  // Append additional filter if provided
  if (filter) {
    baseFilter += ` and ${filter}`;
  }

  const encodedFilter = encodeURIComponent(baseFilter);

  // Start building the paginated OData URL
  let url = `odata/Routecard?$count=true&$select=RouteCardName,RouteCardId&$filter=${encodedFilter}`;

  // Append ordering if specified
  if (order) {
    url += `&$orderby=${order}`;
  }

  // Add pagination parameters
  url += `&$skip=${skip}&$top=${top}`;

  console.log("📡 Paginated Fetch URL:", url);

  return api.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
