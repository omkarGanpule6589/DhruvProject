import * as Yup from "yup";

export const validation = Yup.object({
  Name: Yup.string().required("Enter Inventory Location name"),
  Description: Yup.string()
});