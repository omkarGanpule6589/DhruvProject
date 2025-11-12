import * as Yup from "yup";

export const validation = Yup.object({
  RemoveDifferenceReasonName: Yup.string().trim().required("Remove Difference Reason Name is required"),
});
