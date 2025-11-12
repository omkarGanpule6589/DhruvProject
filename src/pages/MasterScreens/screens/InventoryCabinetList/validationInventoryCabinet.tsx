import * as Yup from "yup";

export const validation = Yup.object({
  InventoryLocationId: Yup.string().required("Enter Inventory Location name"),
  Cabinet: Yup.string()
});