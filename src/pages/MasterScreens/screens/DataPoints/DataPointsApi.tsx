import { api } from "../../../../components/API/apiConfig";

export function getDataPointsList() {
  return api.get(
    `/odata/DataPoint?$select=DataPointId,DataPointName,DataPointType,UpperLimit,LowerLimit`
  );
}

export function getDataPointsById(id) {
  return api.get(`/odata/DataPoint?$filter=DataPointId eq ${id}`);
}

export function editDataPoints(id, reqObj) {
  return api.patch(`/odata/DataPoint?key=${id}`, reqObj);
}

export function getDataCollDefNames() {
  return api.get(
    `/odata/DataCollectionDef?$select=DataCollectionDefId,DataCollectionName`
  );
}

export function getUomNames() {
  return api.get(`/odata/UOM?$select=Uomid,Uomname`);
}
export function createDataPoint(reqObj) {
  return api.post(`/odata/DataPoint`, reqObj);
}
