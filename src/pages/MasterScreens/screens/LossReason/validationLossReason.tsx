import * as Yup from "yup";

export const validation = Yup.object({
  LossReasonName: Yup.string().trim().required("Loss Reason Name is required"),
  //Description: Yup.string()
});