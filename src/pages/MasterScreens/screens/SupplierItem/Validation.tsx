import * as Yup from "yup";

export const validation = Yup.object({
  SupplierItemName: Yup.string().required("Enter Supplier Item Name"),
});
