import * as Yup from "yup";

export const validation = Yup.object({
  AdjustReasonName: Yup.string().required("Enter adjust reason name"),
  Description: Yup.string()
});