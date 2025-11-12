import * as Yup from "yup";

export const validation = Yup.object({
  AqllevelName: Yup.string().trim().required("AQL Level Name is required"),
});
