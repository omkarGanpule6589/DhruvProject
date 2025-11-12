import { api } from "../../../../components/API/apiConfig";

export function getFutureHoldDetailsList() {
  return api.get(
    `/odata/FutureHoldDetails?$select=futureHoldDetailsId,expression,holdDays`
  );
}

export function getFutureHoldDetailsById(id) {
  return api.get(
    `/odata/FutureHoldDetails?$filter=FutureHoldDetailsId eq ${id}`
  );
}

export function getFutureHoldSetupNames() {
  return api.get(
    `/odata/FutureHoldSetup?$select=FutureHoldSetupId,FutureHoldSetup1`
  );
}

export function getOperationNames() {
  return api.get(`/odata/Operation?$select=OperationId,OperationName`);
}

export function getOperationDetailNames() {
  return api.get(
    `/odata/OperationDetail?$select=OperationDetailId,OperationDetailName`
  );
}
export function getProductNames() {
  return api.get(`/odata/Product?$select=ProductId,ProductName`);
}
export function getProductionOrderNames() {
  return api.get(
    `/odata/ProductionOrder?$select=ProductionOrderId,ProductionOrderName`
  );
}
export function getHoldReasonNames() {
  return api.get(`/odata/HoldReason?$select=HoldReasonId,HoldReasonName`);
}
export function getEmailNotificationNames() {
  return api.get(
    `/odata/EmailNotification?$select=EmailNotificationId,EmailNotification1`
  );
}
export function getHoldLocationNames() {
  return api.get(`/odata/HoldLocation?$select=HoldLocationId,HoldLocation1`);
}
export function editFutureHoldDetails(id, reqObj) {
  return api.patch(`/odata/FutureHoldDetails?key=${id}`, reqObj);
}
export function CreateFutureHoldDetails(params) {
  return api.post("/odata/FutureHoldDetails", params);
}
