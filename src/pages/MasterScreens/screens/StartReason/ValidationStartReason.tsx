import * as Yup from "yup";

export const validation = Yup.object({
  StartReasonName: Yup.string().trim().required(" Start Reason Name is required"),
 
});
