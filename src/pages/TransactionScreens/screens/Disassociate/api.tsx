import { api, FocoVisionnapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";
export function getdisAssociateRouteCad(params) {
  const accessToken = getSessionToken();
  return api.post("svc/DisassociateService/GridToDisassociate", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function PostdisAssociate(params) {
  const accessToken = getSessionToken();
  return api.post("svc/DisassociateService/Disassociate", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getroutecardlist() {
  const accessToken = getSessionToken();
  const currentDate = new Date().toISOString().slice(0, 10);
  return api.get(
    `odata/Routecard?$select=RouteCardName,RouteCardId&$filter=Status ne 2 and ChildCount gt 0`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}


export function getDatacollection(routeCardId,focovisionMachineId) {
  const accessToken = getSessionToken();
  return api.get("/api/focovision/latest", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
     params: {
      RouteCardId: routeCardId,
      MachineId: focovisionMachineId,  // 👈 This is how the query param is passed
    },
  });
}
