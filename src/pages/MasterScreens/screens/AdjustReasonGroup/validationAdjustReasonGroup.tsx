import * as Yup from "yup";

export const validation = Yup.object({
  AdjustReasonGroupName: Yup.string().required("Enter adjust reason group"),
  Description: Yup.string(),
});
