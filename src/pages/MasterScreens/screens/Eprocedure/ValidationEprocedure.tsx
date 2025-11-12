import * as Yup from "yup";

export const validation = Yup.object({
    EProcName: Yup.string().required("Enter EProcedure Name"),
 });