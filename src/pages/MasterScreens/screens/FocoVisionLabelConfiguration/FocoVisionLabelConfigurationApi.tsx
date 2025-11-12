import { api, GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getFocoVisionLabelConfigurationList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/FocoVisionLabelConfiguration?expand=*`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}


export function editFocoVisionLabelConfiguration(id, reqObj) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/FocoVisionLabelConfiguration?key=${id}`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function AddFocoVisionLabelConfiguration(reqObj) {
  const accessToken = getSessionToken();
  return api.post(`/odata/FocoVisionLabelConfiguration`, reqObj,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getFocoVisionLabelConfigurationId(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/FocoVisionLabelConfiguration?$filter=FocoVisionLabelConfigurationId eq ${id}&$expand=*`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getItCustomerMaster() {
  const accessToken = getSessionToken();
  return GKBapi.get(`OData/CustomerMaster`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
       
    },
  });
}


export function getDataPointList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/DataPoint`,
  {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getItemClasses() {
  const accessToken = getSessionToken();
  return GKBapi.get(`OData/ItemClassMaster`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
       
  },
  });
}

export function getItemTypeByClass(ItemClassName) {
  const accessToken = getSessionToken();
  const encodedLensType = encodeURIComponent(ItemClassName);
  return GKBapi.get(
    `api/GetUniqueItemTypeCategory?ItemClassName=${encodedLensType}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        
      },
    }
  );
}

export function getUniqueProduct(param1, param2) {
  const accessToken = getSessionToken();
  return GKBapi.get(
    `/api/GetUniqueLensType?ItemClassName=${param2}&ItemClassMatrix=${param1}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
       
      },
    }
  );
}