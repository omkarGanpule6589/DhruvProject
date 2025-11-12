import { api } from "../../../../components/API/apiConfig";

export function getMaterialList() {
  return api.get(
    `/odata/MaterialList?$select=MaterialListId,IssueControl,QtyRequired,EffectiveFromDate,EffectiveToDate`
  );
}

export function getMaterialListById(id) {
  return api.get(`/odata/MaterialList?$filter=MaterialListId eq ${id}`);
}

export function editMaterialList(id, reqObj) {
  return api.patch(`/odata/MaterialList?key=${id}`, reqObj);
}

export function getProductNames() {
  return api.get(`/odata/Product?$select=ProductId,ProductName`);
}

export function getBomNames() {
  return api.get(`/odata/Bom?$select=Bomid,Bomname`);
}

export function getUomNames() {
  return api.get(`/odata/UOM?$select=Uomid,Uomname`);
}

export function getOperationNames() {
  return api.get(`/odata/Operation?$select=OperationId,OperationName`);
}

export function CreateMaterialList(params) {
  return api.post(`/odata/MaterialList`, params);
}
