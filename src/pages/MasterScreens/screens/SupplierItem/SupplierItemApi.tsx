import { api } from "../../../../components/API/apiConfig";

export function getSupplierItemList() {
  return api.get(
    `/odata/SupplierItem?$select=SupplierItemsId,SupplierItemName`
  );
}

export function getSupplierItemById(id) {
  return api.get(`/odata/SupplierItem?$filter=SupplierItemsId eq ${id}`);
}

export function getSupplierList() {
  return api.get(`/odata/Supplier?$select=SupplierId,Supplier1`);
}

export function UpdateSupplierItemdetails(id, params) {
  return api.patch(`/odata/SupplierItem?key=${id}`, params);
}
export function CreateSupplierItem(params) {
  return api.post("/odata/SupplierItem", params);
}
