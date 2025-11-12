import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
import { ErrorNotification } from "../../../../components/common/AlertMessage/AlertMessage";

export function getroutecardlist() {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);
  return api.get(
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=Status eq 3 and Status ne 2 and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getroutecardlistmain() {
  const accessToken = getSessionToken();
  return api.get(`odata/Routecard`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getReleasereasonlist() {
  const accessToken = getSessionToken();
  return api.get(`odata/ReleaseReason`, {
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
export function postRelease(params) {
  const accessToken = getSessionToken();

  return api.post("svc/ReleaseService/Release", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getreleasetabout(params) {
  const accessToken = getSessionToken();

  return api.post("svc/ReleaseService/ReleaseTab", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}



export function getroutecardlistPaginated(skip = 0, top = 10, filter = "", order = "") {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);

  // Base filter from original function
  let baseFilter = `Status eq 3 and Status ne 2 and (ExpirationDate gt ${currentDate} or ExpirationDate eq null)`;

  // Append additional filters if provided
  if (filter) {
    baseFilter += ` and ${filter}`;
  }

  // Encode the full filter string
  const encodedFilter = encodeURIComponent(baseFilter);

  // Build the OData URL
  let url = `odata/Routecard?$count=true&$select=RouteCardName,RouteCardId&$filter=${encodedFilter}`;

  // Add ordering if specified
  if (order) {
    url += `&$orderby=${order}`;
  }

  // Pagination
  url += `&$skip=${skip}&$top=${top}`;

  console.log("📡 Fetch URL:", url);

  return api.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
