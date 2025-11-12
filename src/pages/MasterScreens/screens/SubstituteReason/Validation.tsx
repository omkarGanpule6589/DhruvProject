import * as Yup from "yup";

export const validation = Yup.object({
  SubstituteReasonName: Yup.string().trim().required("Substitute Reason Name is required"),
});
