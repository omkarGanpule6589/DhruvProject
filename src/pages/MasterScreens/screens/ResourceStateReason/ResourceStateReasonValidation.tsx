import * as Yup from "yup";

export const validation = Yup.object({
    ResourceStateReasonName: Yup.string().min(2).max(25).required("Enter  Resource State Reason Name "),
});