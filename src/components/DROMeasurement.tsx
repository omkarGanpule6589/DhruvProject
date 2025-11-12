// src/components/DROMeasurement.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Typography,
  Button,
  Paper,
  TextField,
  Snackbar,
  Alert,
  Divider,
  Zoom,
  useMediaQuery,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import LensIcon from "@mui/icons-material/BlurCircular";
import StepIcon from "@mui/icons-material/LooksOne";
import { useTheme } from "@mui/material/styles";
import { signalRService } from "./services/signalrService";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

export const DROMeasurement: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [measuring, setMeasuring] = useState(false);
  const [dia, setDia] = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [stepValues, setStepValues] = useState<number[]>([0, 0, 0, 0, 0]);

  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [drop, setDrop] = useState(0);
  const [inset, setInset] = useState(0);

  const [snack, setSnack] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    signalRService
      .start()
      .then(() => {
        setConnected(true);
        signalRService.onReceiveMeasurement((data) => {
          const stepVals = data.stepValues || [0, 0, 0, 0, 0];
          setCurrentStep(data.currentStep);
          setStepValues(stepVals);

          setHeight(stepVals[0]);
          setDrop(dia / 2 - (stepVals[0] + stepVals[1]));
          setWidth(stepVals[3]);
          setInset((stepVals[2] - stepVals[4]) / 2);
        });
      })
      .catch(() => {
        setSnack({ msg: "Failed to connect to DRO machine", type: "error" });
      });
  }, [dia]);

  const handleStart = () => {
    if (dia <= 0) {
      setSnack({ msg: "Please enter valid DIA", type: "error" });
      return;
    }
    signalRService.startMeasurement();
    setMeasuring(true);
    setSnack({ msg: "Measurement started", type: "success" });
  };

  const handleStop = () => {
    signalRService.stopMeasurement();
    setMeasuring(false);
    setSnack({ msg: "Measurement stopped", type: "success" });
  };

  const handleResetStep = (step: number) => {
    signalRService.resetStep(step);
    setSnack({ msg: `Step ${step} reset`, type: "success" });
  };

  const handleResetAll = () => {
    signalRService.resetAll();
    setSnack({ msg: "All steps reset", type: "success" });
  };

  return (
    <Box p={3} bgcolor="#f4f6fa" minHeight="100vh">
      <Zoom in>
        <Paper elevation={6} sx={{ p: 6, maxWidth: "1200px", margin: "auto" }}>
          <Typography
            variant="h4"
            gutterBottom
            color="primary"
            fontWeight={600}
          >
            <LensIcon sx={{ mr: 2, verticalAlign: "middle",marginBottom:10 }} />
            DRO Lens Measurement
          </Typography>

          <Grid container spacing={3}>
            {/* Form Fields */}
            <Grid xs={8}>
              <Grid container spacing={2}
                  rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                <Grid item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Lens DIA"
                    variant="outlined"
                    value={dia}
                    onChange={(e) => setDia(parseFloat(e.target.value))}
                    disabled={measuring}
                  />
                </Grid>

                <Grid  item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    label="Height (1st)"
                    variant="outlined"
                    value={(Math.abs(height)).toFixed(2)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                 <Grid  item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    label="Drop"
                    variant="outlined"
                    value={(Math.abs(drop)).toFixed(2)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                 <Grid  item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    label="Width (4th)"
                    variant="outlined"
                    value={Math.abs(width).toFixed(2)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                 <Grid  item
            xs={12}
            sm={12}
            md={4}
            style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    fullWidth
                    label="Inset"
                    variant="outlined"
                    value={Math.abs(inset).toFixed(2)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>

              <Box mt={3}>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<PlayArrowIcon />}
                  onClick={handleStart}
                  disabled={measuring}
                  sx={{ mr: 2 }}
                >
                  Start
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<StopIcon />}
                  onClick={handleStop}
                  disabled={!measuring}
                >
                  Stop
                </Button>
              </Box>
            </Grid>

            {/* Step Values Display */}
            <Grid xs={4}>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: "#e3f2fd" }}>
                <Typography variant="h6" color="primary" gutterBottom>
                  Live Step Values
                </Typography>
                <Divider sx={{ mb: 2 }} />

                {stepValues.map((val, idx) => (
                  <Box
                    key={idx}
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color:
                          currentStep === idx + 1 ? "green" : "text.primary",
                        fontWeight: currentStep === idx + 1 ? 600 : 400,
                      }}
                    >
                      <StepIcon fontSize="small" sx={{ mr: 1 }} />
                      Step {idx + 1}: {val.toFixed(2)}
                    </Typography>

                    <Button
                      size="small"
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleResetStep(idx + 1)}
                      startIcon={<RestartAltIcon />}
                      sx={{
                        textTransform: "none",
                        borderRadius: 2,
                        fontWeight: 500,
                        "&:hover": { backgroundColor: "#ffe0b2" },
                      }}
                    >
                      Reset
                    </Button>
                  </Box>
                ))}
                <Box textAlign="center" mt={2}>
                  <Button
                    variant="contained"
                    color="warning"
                    startIcon={<RestartAltIcon />}
                    onClick={handleResetAll}
                    sx={{
                      borderRadius: 3,
                      px: 3,
                      py: 1,
                      fontWeight: "bold",
                      textTransform: "none",
                      background: "linear-gradient(45deg, #ff9800, #ff5722)",
                      color: "white",
                      "&:hover": {
                        background: "linear-gradient(45deg, #ff7043, #e64a19)",
                      },
                    }}
                  >
                    Reset All Steps
                  </Button>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Zoom>

      <Snackbar
        open={!!snack}
        autoHideDuration={4000}
        onClose={() => setSnack(null)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        {snack ? (
          <Alert
            severity={snack.type}
            onClose={() => setSnack(null)}
            variant="filled"
          >
            {snack.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Box>
  );
};
