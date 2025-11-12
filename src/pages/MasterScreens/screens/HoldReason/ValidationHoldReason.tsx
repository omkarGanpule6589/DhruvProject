import * as Yup from "yup";

export const validation = Yup.object({
  HoldReasonName: Yup.string().trim().required("Hold Reason Name is required"),
  //Description: Yup.string(),
});
