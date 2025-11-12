import * as Yup from "yup";

export const validation = Yup.object({
    ReleaseReasonName: Yup.string().trim().required("Release Reason Name is required"),
});
