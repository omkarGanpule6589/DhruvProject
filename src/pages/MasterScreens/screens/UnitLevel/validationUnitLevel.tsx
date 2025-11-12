import * as Yup from "yup";

export const validation = Yup.object({
  UnitLevel1: Yup.string().trim().required("Unit Level Name is required"),  
});
