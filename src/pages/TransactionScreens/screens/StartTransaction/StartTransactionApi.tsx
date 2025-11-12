import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getStartDepartmentNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/department?$select=DepartmentId,DepartmentName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getCustomerNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/customer?$select=CustomerName,CustomerId`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getFactoryNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/Factory?$select=FactoryId,FactoryName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProcessflowNames() {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Processflow?$select=ProcessflowId,ProcessflowName,ProcessflowRevision,ActiveRevision`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getLocationNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/FactoryLocationDetail`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProductionOrderNames() {
  const accessToken = getSessionToken();
  return api.get(
    `odata/ProductionOrder?$select=ProductionOrderId,ProductionOrderName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getProductNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/Product`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getUOMNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/UOM?$select=UOMId,UOMName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getStartReasonNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/StartReason?$select=StartReasonId,StartReasonName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getUnitLevelNames() {
  const accessToken = getSessionToken();
  return api.get(`odata/UnitLevel?$select=UnitLevelId,UnitLevel1`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getSupplierItemNames() {
  const accessToken = getSessionToken();
  return api.get(
    `odata/SupplierItem?$select=SupplierItemsId,SupplierItemName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function TransactionStart(params) {
  const accessToken = getSessionToken();
  return api.post("svc/RouteCardStartService/RouteCardStart", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getlocbyfac(id1) {
  const accessToken = getSessionToken();
  return api.get(`odata/FactoryLocationDetail?$filter=FactoryId eq ${id1}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function ProductByProductionorder(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/Productionorder?$filter=ProductionOrderId eq ${id}&$expand=Product($expand=Processflow)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
