import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getBomList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Bom?$select=Bomid,Bomname,Bomrevision,ActiveRevision,IsActive,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getBomListById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Bom?$filter=Bomid eq ${id}&$expand=LastModifiedUser,MaterialLists($expand=Product,Operation,Uom,AlternateMaterialProduct;$filter=IsDeleted ne true)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editBom(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Bom?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function createBom(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/Bom`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function GetMaterialList(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Bom?$filter=Bomid eq ${id}&$expand=MaterialLists($expand=*)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function GetProductNAme(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/product?$filter=ProductId eq ${id}&$select=ProductName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function GetOperationNAmes(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Operation?$filter=OperationId  eq ${id}&$select=OperationName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getProductNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Product?$filter=State ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getUomNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/UOM?$select=Uomid,Uomname`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getOperationNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Operation?$select=OperationId,OperationName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function DeleteMaterialLists(id) {
  const accessToken = getSessionToken();
  return api.delete(`/odata/MaterialList?key=${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function odatabatch(body) {
  const accessToken = getSessionToken();
  return api.post(`odata/$batch`, body, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
