import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getProductGroupList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/ProductGroup?$expand=CreatedUser`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getProductGrouplDetailFetch(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/ProductGroup?$filter=ProductGroupId eq ${id}&$expand=LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function EditProductGrouptails(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/ProductGroup?key=${id}`, reqObj, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateProductGroup(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/ProductGroup", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
