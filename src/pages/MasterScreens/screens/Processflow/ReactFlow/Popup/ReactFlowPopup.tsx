import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

type Dialog = {
  open: boolean;
  data?: any | unknown;
  children: any | unknown;
  onClose: () => void;
};

const MUIDialog = ({ open, children, onClose, data }: Dialog) => {
  return (
    <>
      <Dialog
        open={open}
        aria-label="dialog-title"
        aria-describedby="dialog-description"
        fullWidth={true}
      >
        <DialogTitle id="dialog-title">{children}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            <Typography
              variant="body1"
              sx={{
                color: "#000",
                fontWeight: "bolder",
                display: "flex",
                alignItems: "center",
              }}
            >
              Sequence: <Typography>{data?.Sequence}</Typography>
            </Typography>
            <Typography
              variant="body1"
              sx={{
                color: "#000",
                fontWeight: "bolder",
                display: "flex",
                alignItems: "center",
              }}
            >
              Operation Detail:
              <Typography>
                {data?.OperationDetail?.OperationDetailName}:{" "}
                {data?.OperationDetail?.Revision}
              </Typography>
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            onClick={() => onClose()}
            sx={{ textTransform: "capitalize" }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MUIDialog;
