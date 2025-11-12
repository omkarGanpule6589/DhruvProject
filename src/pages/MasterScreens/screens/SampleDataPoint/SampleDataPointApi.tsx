import { api } from "../../../../components/API/apiConfig";
import { getSessionToken } from "../../../../components/AuthUser";

export function getSampleDataPointList() {
  const accessToken = getSessionToken();
  return api.get(
    `/odata/Sampledatapoint?Select=SampleDataPointId,SampleDataPointName,Revision,Description,ActiveRevision,CreatedDateTime&$expand=CreatedUser`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
}

export function getSampleDataPointbyid(id) {
  const accessToken = getSessionToken();
  return api.get(`odata/Sampledatapoint?$filter=SampleDataPointId eq ${id}&$expand=Uom,LastModifiedUser`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function UpdateSampleDataPointList(id, params) {
  const accessToken = getSessionToken();
  return api.patch(`/odata/Sampledatapoint?key=${id}`, params, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export function CreateSampleDataPointList(params) {
  const accessToken = getSessionToken();
  return api.post("/odata/Sampledatapoint", params, {
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
