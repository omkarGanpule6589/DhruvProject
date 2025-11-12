import * as Yup from "yup";

export const validation = Yup.object({
  CustomerName: Yup.string().trim().required("Customer Name is required"),
 });