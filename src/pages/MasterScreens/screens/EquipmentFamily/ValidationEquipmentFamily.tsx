import * as Yup from "yup";

export const validation = Yup.object({
    EquipmentFamilyName: Yup.string().trim().required("Equipment Family Name is required"),
 });