import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getSamplingPlanList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SamplingPlan?Select=SamplingPlanId,SamplingPlanName,Revision, Description,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getSamplingPlanListById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `odata/SamplingPlan?$filter=SamplingPlanId eq ${id}&$expand=SamplingPlanDetails($expand=Operation,DataCollectionDef,Aqllevel,InspectionLevel,SampleTest;$filter=IsDeleted ne true),Operation,InspectionLevel,Aqllevel,LastModifiedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function UpdateSamplingPlanList(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/SamplingPlan?key=${id}`, params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function CreateSamplingPlanList(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/SamplingPlan", params, {
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
export function getAqllevelNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Aqllevel?$select=AqllevelId,AqllevelName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getInspectionLevelNames() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/InspectionLevel?$select=InspectionLevelId,InspectionLevelName`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}
export function getDataCollectiondefNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/DataCollectionDef`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getSampleTestNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/SampleTest?$filter=IsActive ne false`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
export function getOperationDetailNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/SampleTest`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
