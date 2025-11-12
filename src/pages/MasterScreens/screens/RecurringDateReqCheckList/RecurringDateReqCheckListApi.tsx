import { api } from "../../../../components/API/apiConfig";

export function getRecurringDateReqCheckList() {
  return api.get(
    `/odata/RecurringDateReqCheckList?$select=CheckListName,RecurringDateReqCheckListId,RecurringDateReqId,IsRecuDateReqActiveRev,Instruction,EmployeeGroupId,SingleOnly,DataCollectionDefId,Notes`
  );
}


export function getRecurringDateReqCheckListById(id) {
    return api.get(`/odata/RecurringDateReqCheckList?$filter=RecurringDateReqCheckListId eq ${id}`);
  }
  
  export function getEmployeeGroup() {
    return api.get(`/odata/EmployeeGroup?$select=EmployeeGroupId,EmployeeGroupName`);
  }
  export function getDataCollectionDef() {
    return api.get(`/odata/DataCollectionDef?$select=DataCollectionDefId,DataCollectionName`);
  }
  export function getRecurringDateRequirement() {
    return api.get(`/odata/RecurringDateRequirement?$select=RecurringDateRequirementId,RecurringDateRequirement1`);
  }
  export function CreateRecurringDateReqCheckList(params) {
    return api.post("/odata/RecurringDateReqCheckList", params);
  }
  export function editRecurringDateReqCheckList(id, reqObj) {
    return api.patch(`/odata/RecurringDateReqCheckList?key=${id}`, reqObj);
  }
  
