import { api } from "../../../../components/API/apiConfig";

export function getUsageReqCheckList() {
  return api.get(
    `/odata/UsageReqCheckList?$select=UsageReqCheckListId,CheckListName,Instruction`
  );
}
export function getUsageReqCheckListdetailsFetch(id) {
  return api.get(
    `/odata/UsageReqCheckList?$filter=UsageReqCheckListId eq ${id}&$select=CheckListName,UsageReqId,IsUsageReqActiveRev,IsUsageReqActiveRev,Instruction,EmployeeGroupId,SingleOnly,DataCollectionDefId`
  );
}
export function UpdateSUsageReqCheckList(id, params) {
  return api.patch(`/odata/UsageReqCheckList?key=${id}`, params);
}
export function CreateUsageReqCheckList(params) {
  return api.post("/odata/UsageReqCheckList", params);
}

export function getmentGroupNamesforUsagereq() {
  return api.get(
    `/odata/UsageRequirement?$select=UsageRequirementId,UsageRequirement1`
  );
}

export function getEmployeeGroupNamesforUsagereq() {
  return api.get(
    `/odata/EmployeeGroup?$select=EmployeeGroupId,EmployeeGroupName`
  );
}
export function getDataCollectionDefforUsagereq() {
  return api.get(
    `/odata/DataCollectionDef?$select=DataCollectionDefId,DataCollectionName`
  );
}
