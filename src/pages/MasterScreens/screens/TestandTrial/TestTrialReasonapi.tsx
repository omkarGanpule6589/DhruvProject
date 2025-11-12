import { api,GKBapi } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getTestTrialReasonList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/TestTrialReason?$select=TestTrialReasonId,TestTrialReason1,TestTrialDescription,ItemClassId,ItemTypeCategoryId,CreatedDateTime,ClosureDate`,{
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

export function getTestTrialReasondetailsFetch(id) {
    const accessToken = getSessionToken();
    return api.get(`/odata/TestTrialReason?$filter=TestTrialReasonId eq ${id}&$select=TestTrialReasonId,TestTrialReason1,TestTrialDescription,CreatedDateTime,ClosureDate,ItemClassId,ItemTypeCategoryId&$expand=ItemClass,ItemTypeCategory`,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    
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

  export function CreateTestTrialReason( params) {
    const accessToken = getSessionToken();
    return api.post("/odata/TestTrialReason", params,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }

  export function UpdateTestTrialReasons(id, params) {
    const accessToken = getSessionToken();
    return api.patch(`/odata/TestTrialReason?key=${id}`, params,{
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  }