import * as Yup from "yup";

export const validation = Yup.object({
    Uomname: Yup.string().trim().required("UOM Name is required"),
 });