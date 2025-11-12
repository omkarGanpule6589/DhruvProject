import * as Yup from "yup";

export const validation = Yup.object({
    TestTrialReason1: Yup.string().trim().required("Test Trial Reason is required"),
  //Description: Yup.string(),
});
