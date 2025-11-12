import * as Yup from "yup";

export const validation = Yup.object({
  EsigRequirement: Yup.string()
    .min(2)
    .max(25)
    .required("Enter adjust reason name"),
});
