import * as Yup from "yup";

export const validation = Yup.object({
  IssueDifferenceReasonName: Yup.string().trim().required("Issue Difference Reason Name is required"),
});