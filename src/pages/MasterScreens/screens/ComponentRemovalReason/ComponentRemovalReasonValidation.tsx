import * as Yup from "yup";

export const validation = Yup.object({
  CompRemovalReasonName: Yup.string().trim().required(
    "Component Removal Reason Name is required"
  ),
});
