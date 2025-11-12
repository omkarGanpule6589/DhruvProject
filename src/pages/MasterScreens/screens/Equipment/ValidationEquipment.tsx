import * as Yup from "yup";

export const validation = Yup.object({
    EquipmentName: Yup.string().trim().required("Equipment Name is required"),
    BarcodeNo:Yup.string().trim().required("Bar Code Number is required"),
 });