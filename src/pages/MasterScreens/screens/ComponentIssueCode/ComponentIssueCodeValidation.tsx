import * as Yup from "yup";

export const validation = Yup.object({
  ComponentIssueCode1: Yup.string().trim().required("Component Issue Code Name is required"),
  //Description: Yup.string()
});