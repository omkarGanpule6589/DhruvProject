import * as Yup from "yup";

export const validation = Yup.object({
  InventoryLocation1: Yup.string().trim().required("Inventory Location Name is required"),
 
});