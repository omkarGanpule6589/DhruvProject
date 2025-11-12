import * as Yup from "yup";

export const validation = Yup.object({
    Bomname: Yup.string().trim().required("BOM Name is required"),
    Bomrevision: Yup.string().trim().required("Revision is required"),
});