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
  return api.post("svc/InwardService/Inward", params, {
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

export function getEmployeeList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Employee?$select=EmployeeId,EmployeeName,FullName,Designation,EmailAddress,RoleId,FactoryId,EmployeeCode,CreatedDateTime&$expand=CreatedUser
`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getEmployeeById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Employee?$filter=EmployeeCode eq '${id}'&$expand=EmployeeOperationMappings($expand=Operation;$filter=IsDeleted%20ne%20true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getOederinfo(producionordername) {
  const accessToken = getSessionToken();
  return api.get(`OData/OrderHeaderMaster?$filter=OrderNumber eq '${producionordername}'&$expand=Customer`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getcustomerinfo(customerid) {
  const accessToken = getSessionToken();
  return api.get(`OData/customermaster?$filter=CustomerId eq ${customerid}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function GetRcDetailsInWard(params) {
  const accessToken = getSessionToken();
  return api.post("svc/RouteCardTabOutSevice/RouteCardTabOutInward", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}