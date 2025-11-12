import * as Yup from "yup";

export const validation = Yup.object({
  ChangeStateReasonName: Yup.string().trim().required("Change State Reason Name is required"),
  //Description: Yup.string(),
});
