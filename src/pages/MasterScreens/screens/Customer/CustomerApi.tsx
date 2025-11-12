import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getCustomerList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Customer?$select=CustomerId,CustomerName,CompanyDescription,CreatedDateTime&$expand=CreatedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getCustomerById(id) {
  const accessToken = getSessionToken();
  return api.get(`/odata/Customer?$filter=CustomerId eq ${id}&$expand=LastModifiedUser`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function editCustomer(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Customer?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateCustomer(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/Customer", params,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}