import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getCustomerList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Customer?$select=CustomerId,CustomerName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getSupplierList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Supplier?$select=SupplierId,Supplier1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getDepartmentList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Department?$select=DepartmentId,DepartmentName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getProductionOrder() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductionOrder?$select=ProductionOrderId,ProductionOrderName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getUOMLIst() {
  const accessToken = getSessionToken();
  return api.get(`/odata/UOM?$select=Uomid,Uomname`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getFactoryList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Factory?$select=FactoryId,FactoryName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getUnitLevelList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/unitLevel?$select=UnitLevelId,UnitLevel1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getstartReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/startReason?$select=StartReasonId,StartReasonName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getRoutecardList() {
  const accessToken = getSessionToken();
  return api.get(`odata/Routecard`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getRoutecardIdbyfilter(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Routecard?$filter=RouteCardId eq ${id}&$expand=Product,HoldReason,ProductionOrder,StartReason,StartFactory,Uom,UnitLevel,Department,Customer,SupplierItem,CurrentStatus($expand=OperationDetail,ProcessflowStep($expand=Processflow))`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function PostRouteCardMaintenace(params) {
  const accessToken = getSessionToken();
  return api.post(
    "svc/RouteCardMaintenanceService/RouteCardMaintenance",
    params,
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
export function getproductList() {
  const accessToken = getSessionToken();
  return api.get(`odata/Product`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
