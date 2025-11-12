import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import { TextField, Typography } from "@mui/material";
import { useParams } from "react-router-dom";

export default function ChangeQtyHistoryAddEdit() {
  const { id } = useParams();

  return (
    <div className="content">
      <Typography component="h1" variant="h5">
        {!id ? "Add Change Qty History" : "Edit  Change Qty History"}
      </Typography>{" "}
      <br />
      <Grid container rowSpacing={1} columnSpacing={{ xs: 2, sm: 2, md: 2 }}>
        <Grid
          item
          xs={6}
          sm={6}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="HMLID">History Main Line ID</label>
          <TextField id="outlined-start-adornment" />
        </Grid>
        <Grid
          item
          xs={6}
          sm={6}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="CID">Container ID</label>
          <TextField id="outlined-start-adornment" />
        </Grid>

        <Grid
          item
          xs={6}
          sm={6}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="RID">Reason ID</label>
          <TextField id="outlined-start-adornment" />
        </Grid>

        <Grid
          item
          xs={6}
          sm={6}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="CQT">Change Qty Type</label>
          <TextField id="outlined-start-adornment" />
        </Grid>

        <Grid
          item
          xs={6}
          sm={6}
          md={4}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <label htmlFor="QC"> Qty Changed</label>
          <TextField id="outlined-start-adornment" />
        </Grid>
      </Grid>
      <div className="actionFooter">
        {!id ? (
          <>
            <Button
              variant="contained"
              size="small"
              color="primary"
              type="submit"
            >
              Add
            </Button>
            &nbsp;&nbsp;
            <Button
              variant="outlined"
              size="small"
              color="primary"
              type="submit"
            >
              Reset
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="contained"
              size="small"
              color="primary"
              type="submit"
            >
              Update
            </Button>{" "}
            &nbsp;{" "}
            <Button
              variant="outlined"
              size="small"
              color="primary"
              type="submit"
            >
              Reset
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
