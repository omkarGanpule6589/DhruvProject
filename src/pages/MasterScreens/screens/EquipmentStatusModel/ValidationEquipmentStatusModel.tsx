import * as Yup from "yup";

export const validation = Yup.object({
  EquipmentStatusModelName: Yup.string().trim().required("Equipment Status Model Name is required "),
  
});
