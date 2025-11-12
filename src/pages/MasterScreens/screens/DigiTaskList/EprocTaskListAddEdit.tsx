import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { Container, TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import CssBaseline from '@mui/material/CssBaseline';
import { validation } from "./ValidationDigiTaskList";
import "../../../../App.css";
 


export default function DigiTaskListAddEdit() {
    const { id } = useParams();

    const initialValues = {
        TaskListId: null,
        EprocId: null,         
        };


    const { values, errors, touched, handleBlur, handleChange, handleSubmit, handleReset } =
        useFormik({
            initialValues,
            validationSchema: validation,
            onSubmit: (values, action) => {
                console.log(values);
                action.resetForm();
            },
        });
 
    return (
        <>
            <CssBaseline />
            <Container fixed>
                <form onSubmit={handleSubmit} onReset={handleReset}>
                    <Typography component="h1" variant="h5">
                        {!id ? "Add EProcedure task list" : "Edit EProcedure task list"}
                    </Typography>
                    <br />
                    <Grid container rowSpacing={2} columnSpacing={{ xs: 2, sm: 2, md: 3 }}>
                        <Grid item xs={12} sm={12} md={4} style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="TaskListId">TaskList Id</label>
                            <TextField
                                name="TaskListId"
                                id="TaskListId"
                                value={values.TaskListId}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            />
                            {errors.TaskListId && touched.TaskListId ? (
                                <p></p>
                                // <p className="errorTextColor">{errors.TaskListId}</p>
                            ) : null}
                        </Grid>                        
                        <Grid item xs={12} sm={12} md={4} style={{ display: "flex", flexDirection: "column" }}>
                            <label htmlFor="EprocId">Eproc Id</label>
                            <TextField
                                name="EprocId"
                                id="EprocId"
                                value={values.EprocId}
                                onChange={handleChange}
                            />
                        </Grid>  
                     </Grid>
                    <div className="actionFooter">
                        {!id ? (
                            <>
                                <Button variant="contained" size="small" color="primary" type="submit">Add</Button>
                                &nbsp; &nbsp;
                                <Button variant="outlined" size="small" color="primary" type="reset">Reset</Button>
                            </>
                        ) : (
                            <>
                                <Button variant="contained" size="small" color="primary" type="submit">Update</Button>
                                &nbsp; &nbsp;
                                <Button variant="outlined" size="small" color="primary" type="reset">Reset</Button>
                            </>
                        )}
                    </div>
                </form>
            </Container>
        </>
    );
}
