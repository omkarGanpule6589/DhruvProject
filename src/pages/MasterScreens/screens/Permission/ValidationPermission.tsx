import * as Yup from "yup";

export const validation = Yup.object({
    PermissionName: Yup.string().trim().required("Permission Name is required"),
    PermissionType: Yup.string().trim().required("Permission Type is required"),
});
