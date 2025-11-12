import * as Yup from "yup";

export const validation = Yup.object({
  LossReasonGroupName: Yup.string().trim().required("Loss Reason Group Name is required"),
  //Description: Yup.string()
});