import * as Yup from "yup";

export const validation = Yup.object({
  GainReasonName: Yup.string().trim().required("Gain reason Name is required"),
});
