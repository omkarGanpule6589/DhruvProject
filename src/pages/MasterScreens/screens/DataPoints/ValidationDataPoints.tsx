import * as Yup from "yup";

export const validation = Yup.object({
  DataPointName: Yup.string().required("Enter DataPoint Name"),
});
