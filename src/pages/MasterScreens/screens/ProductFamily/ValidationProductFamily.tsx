import * as Yup from "yup";

export const validation = Yup.object({
  ProductFamilyName: Yup.string().trim().required("Product Family Name is required"),
});
