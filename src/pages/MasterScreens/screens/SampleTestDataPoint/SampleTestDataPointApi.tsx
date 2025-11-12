import { api } from "../../../../components/API/apiConfig";

export function getSampleTestDataPointlist() {
  return api.get(`/odata/SampleTestDataPoint?Select=sampleTestDataPointsId`);
}

export function getSampleTestDataPointById(id) {
  return api.get(`/odata/SampleTestDataPoint?$filter=sampleTestDataPointsId eq ${id}&$select=sampleTestId,isSampleTestActiveRev,sampleDataPointId,isSampleDpactiveRev`);
}

export function UpdateSampleTestDataPoint(id, params) {
  return api.patch(`/odata/SampleTestDataPoint?key=${id}`, params);
}

export function CreateSampleTestDataPoint(params) {
  return api.post("/odata/SampleTestDataPoint", params);
}

export function getSampleTestNames() {
  return api.get(`/odata/SampleTest?$select=SampleTestId,SampleTestName`);
}
export function getSampleDataPointNames() {
    return api.get(`/odata/SampleDataPoint?$select=SampleDataPointId,SampleDataPointName`);
  }