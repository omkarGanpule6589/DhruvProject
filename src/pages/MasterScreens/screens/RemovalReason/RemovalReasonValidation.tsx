import * as Yup from "yup";

export const validation = Yup.object({
    RemovalReasonName: Yup.string().min(2).max(25).required("Enter  Removal Reason"),
});
