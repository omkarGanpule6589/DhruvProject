import * as Yup from "yup";

export const validation = Yup.object({
  DataCollectionName: Yup.string().trim().required("Data Collection Name is required"),
  
 });