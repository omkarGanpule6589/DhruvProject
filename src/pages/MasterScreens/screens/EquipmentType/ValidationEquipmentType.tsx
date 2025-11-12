import * as Yup from "yup";

export const validation = Yup.object({
    EquipmentType1: Yup.string().trim().required("Equipment Type Name is required"),
 });