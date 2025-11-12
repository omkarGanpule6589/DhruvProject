import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getProductList(skipno, pageSize, filterurl, orderurl) {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/Product?$top=${pageSize}&$skip=${skipno}&$count=true&${filterurl}&${orderurl}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getTrainingRequirementList() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/TrainingRequirementGroup?$select=TrainingRequirementGroupId,TrainingRequirementGroup1`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

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

export function getStartReasonList() {
  const accessToken = getSessionToken();

  return api.get(`/odata/StartReason?$select=StartReasonId,StartReasonName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getNumberingList() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/NumberingRule?$select=NumberingRuleId,NumberingRuleName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getBOMList() {
  const accessToken = getSessionToken();

  return api.get(`/odata/Bom?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getDocumentList() {
  const accessToken = getSessionToken();

  return api.get(`/odata/Document?$select=DocumentId,DocumentName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProductById(id) {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/Product?$filter=ProductId eq ${id}&$expand=ProductType,Customer,ProductFamily,SubstituteProduct,Supplier,DefaultStartReason,DefaultStartDepartment,NumberingRule,DefaultStartUom,Bom,Processflow,TrainingReqGroup,DocumentGroup,LastModifiedUser,ProductGroup`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editProduct(id, reqObj) {
  const accessToken = getSessionToken();

  return api.patch(`/odata/Product?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function createProduct(reqObj) {
  const accessToken = getSessionToken();

  return api.post(`/odata/Product`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getUOMList() {
  const accessToken = getSessionToken();

  return api.get(`/odata/Uom?$select=Uomid,Uomname`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProductFamilyList1() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/ProductFamily?$select=ProductFamilyId,ProductFamilyName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getProductTypeList() {
  const accessToken = getSessionToken();

  return api.get(`/odata/ProductType?$select=ProductTypeId,ProductTypeName`, {
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
export function getDepartmentList1() {
  const accessToken = getSessionToken();

  return api.get(`/odata/Department?$select=DepartmentId,DepartmentName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getProcessFlowList1() {
  const accessToken = getSessionToken();

  return api.get(`/odata/Processflow?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getDocumentGroupNames1() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/DocumentGroup?$select=DocumentGroupId,DocumentGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getproductgroups() {
  const accessToken = getSessionToken();

  return api.get(
    `/odata/ProductGroup?$select=ProductGroupId,ProductGroupName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getGKBProductById(ItemCode) {
  const accessToken = getSessionToken();
  const encodedLensType = encodeURIComponent(ItemCode);
  return api.get(
    `odata/ProductMaster?$filter=ItemCode eq '${encodedLensType}'&$expand=ItemTypeCategory,ItemType,ItemClass,Material,CoatingGP,LensIndex,Photo,LensColor,LensSide,CustomerOpcs($expand=customer)`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getGKBProducts() {
  const accessToken = getSessionToken();
  return GKBapi.get(`odata/ProductMaster?$top=100`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
