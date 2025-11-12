import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getProductTypeList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductType?$select=ProductTypeId,ProductTypeName,Description,LastModifiedUserId`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getProductTypeById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductType?$filter=ProductTypeId eq ${id}&$select=ProductTypeName,Description,LastModifiedUserId`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function editProductType(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ProductType?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
