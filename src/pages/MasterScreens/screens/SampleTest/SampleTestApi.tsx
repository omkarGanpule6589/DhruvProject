import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getSampletestlist() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SampleTest?Select=SampleTestId,SampleTestName,Revision,Description,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getSampleTestById(id) {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/SampleTest?$filter=SampleTestId eq ${id}&$expand=LastModifiedUser,SampleTestDataPoints($expand=SampleDataPoint;$filter=IsDeleted ne true),ScrapRejectsDefaultReasonNavigation`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function UpdateSampleTestList(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/SampleTest?key=${id}`, params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateSampleTestList(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/SampleTest", params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getLossReasonNames() {
  const accessToken = getSessionToken();
  return api.get(`/odata/LossReason?$select=LossReasonId,LossReasonName`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function getSampleDataPointList() {
  const accessToken = getSessionToken();
  return api.get(`/odata/Sampledatapoint?$filter=IsActive ne false`, {
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
