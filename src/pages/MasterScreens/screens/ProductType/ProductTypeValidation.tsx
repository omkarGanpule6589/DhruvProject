import * as Yup from "yup";

export const validation = Yup.object({
  ProductTypeName: Yup.string().trim().required("Product Type  Name is required"),
});
