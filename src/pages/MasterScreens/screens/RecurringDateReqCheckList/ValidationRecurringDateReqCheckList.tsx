import * as Yup from "yup";

export const validation = Yup.object({
    CheckListName: Yup.string().min(2).required("Enter CheckListName"),
});
