import * as Yup from "yup";

export const validation = Yup.object({
    EquipmentStatusCode1: Yup.string().trim().required("Equipment Status Code Name is required"),
});