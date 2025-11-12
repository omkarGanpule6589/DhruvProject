import * as Yup from "yup";

export const validation = Yup.object({
  SecondAuthentication1: Yup.string().trim().required("Second Authentication Name is required"),
});
