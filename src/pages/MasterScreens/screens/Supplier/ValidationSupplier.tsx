import * as Yup from "yup";

export const validation = Yup.object({
  Supplier1: Yup.string().trim().required("Supplier Name is required"),
  //Description: Yup.string(),
});
