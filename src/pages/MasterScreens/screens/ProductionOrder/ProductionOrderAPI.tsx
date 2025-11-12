import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getProductionOrderList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductionOrder?$select=ProductionOrderId,ProductionOrderName,Description,ProductionOrderQty,ScheduleType,ScheduleLimit,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getProductionOrderById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductionOrder?$filter=ProductionOrderId eq ${id}&$expand=Product,Bom,Processflow,ProductionOrderStatus,ProductionOrderType,NumberingRule,LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editProductionOrder(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ProductionOrder?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProductNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Product?$filter=State ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getBomNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Bom?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProductionOrderStatusNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductionOrderStatus?$select=ProductionOrderStatusId,ProductionOrderStatusName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getProductionOrderTypeNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductionOrderType?$select=ProductionOrderTypeId,ProductionOrderTypeName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function CreateProductionOrder(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ProductionOrder", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getProcessflowList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/processflow?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
