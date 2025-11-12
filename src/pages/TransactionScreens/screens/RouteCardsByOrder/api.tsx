import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getproductionorder(id) {
  const accessToken = getSessionToken();
  return GKBapi.get(`OData/OrderHeaderMaster?$filter=CustomerId eq ${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getroutesonorder(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Routecard?$filter=ProductionOrderId eq ${id}&$expand=Product`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getCustomer() {
  const accessToken = getSessionToken();
  return GKBapi.get("odata/CustomerMaster", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function GetRoutecarddetails(params) {
  const accessToken = getSessionToken();

  return api.post("svc/RouteCardsByOrderService/GetRouteCardDetailsByOrder", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}