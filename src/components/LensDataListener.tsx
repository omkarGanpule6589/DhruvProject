import { useEffect, useRef, useState } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Paper,
  styled,
  Grid,
  Button,
} from "@mui/material";
import Swal from "sweetalert2";
import {
  startConnection,
  onLensDataReceived,
  getConnection,
  registerRouteCard,
  onRouteCardRegistered,
} from "../services/signalRService";
import { AiFillEye } from "react-icons/ai";
import {
  DataGridPro,
  type GridColDef,
  type GridRowParams,
  type GridRowsProp,
} from "@mui/x-data-grid-pro";
import { v4 as uuidv4 } from "uuid";
import { UniqueIdentification1 } from "../pages/TransactionScreens/screens/Move/Move";
import { format, parseISO } from "date-fns";
import { ErrorNotification } from "./common/AlertMessage/AlertMessage";

type FocovisionDataListenerProps = {
  routeCardId: string;
  childList?: UniqueIdentification1[];
  machineId?: number;
  onDataCapture?: (data: LensData) => void;
};

export type LensData = {
  id: string;
  Timestamp: string;
  isEmptyRow?: boolean;
};

const CellBox = styled(Box)<{ status: "collected" | "fetching" | "pending" }>(
  ({ status }) => ({
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontWeight: "bold",
    backgroundColor:
      status === "collected"
        ? "#c8e6c9"
        : status === "fetching"
        ? "#ffe0b2"
        : "#ffcdd2",
    position: "relative",
    cursor: "pointer",
  })
);
const LensDataListener: React.FC<FocovisionDataListenerProps> = ({
  childList,
  machineId,
  onDataCapture,
}) => {
  const [rows, setRows] = useState<UniqueIdentification1[]>(childList);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const startedRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const lastTimestampRef = useRef<string | null>(null);
  const currentIndexRef = useRef(0);

  const sanitizeValue = (value: any) => {
    const invalidPatterns = ["--------", "", null, undefined];
    if (invalidPatterns.includes(value)) return "";
    if (typeof value === "string" && /^[+\-]?\d*\.?\d+$/.test(value))
      return parseFloat(value);
    return value;
  };

  const formatTimestamp = (isoString: string) => {
    try {
      const date = parseISO(isoString);
      return format(date, "dd-MMM-yyyy hh:mm:ss a");
    } catch {
      return null;
    }
  };

  const setCurrentIndexSafe = (index: number) => {
    currentIndexRef.current = index;
    setCurrentIndex(index);
  };

  const setStartedSafe = (started: boolean) => {
    startedRef.current = started;
    setStarted(started);
  };

  const handleStart = async () => {
    setLoading(true);
    try {
      await startConnection();

      onLensDataReceived(handleDataReceived);
      onRouteCardRegistered((msg) => {
        Swal.fire({
          icon: msg.success ? "success" : "error",
          title: msg.message,
          toast: true,
          position: "top-end",
          timer: 2000,
          showConfirmButton: false,
        });
      });

      const nextPendingIndex = rows.findIndex((r) => !r.dataCollected);

      if (nextPendingIndex !== -1) {
        setCurrentIndexSafe(nextPendingIndex);
        const pendingRouteCardId = rows[nextPendingIndex].routeCardId;
        if (pendingRouteCardId && machineId) {
          registerRouteCard(pendingRouteCardId, machineId);
        }
      }

      setStartedSafe(true);
    } catch (err: any) {
      Swal.fire({
        icon: "error",
        title: "SignalR Connection Failed",
        text: err?.message || "Check backend or refresh the page.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async () => {
    const connection = getConnection();
    if (connection) {
      try {
        await connection.stop();
        console.log("SignalR connection stopped");
      } catch (err) {
        console.error("Failed to stop SignalR:", err);
      }
    }
    setStartedSafe(false);
    setCurrentIndexSafe(0);
    lastTimestampRef.current = null;
  };

  const handleDataReceived = (message: any) => {
    try {
      // setLoading(true);
      console.log("LensDataReceived from server:", message);

      if (message.error) {
        ErrorNotification("Error: " + message.message);
        return;
      }

      if (!startedRef.current) return;

      if (message.timeStamp === lastTimestampRef.current) return;
      lastTimestampRef.current = message.timeStamp;

      const index = currentIndexRef.current;

      const result = Object.keys(message.filteredData).reduce((acc, key) => {
        acc[key.toLowerCase()] = sanitizeValue(message.filteredData[key]);
        return acc;
      }, {} as Record<string, any>);

      const newRows = [...rows];
      const currentItem = newRows[index];

      if (currentItem.dataCollected) {
        console.log("Skipping update: already collected and not in edit mode");
        return;
      }

      // Update current route card's values
      currentItem.Datacollection1 = currentItem.Datacollection1.map((d) => {
        const val = result[d.dataPointName.toLowerCase()];
        return val !== undefined ? { ...d, defaultValue: val } : d;
      });
      currentItem.dataCollected = true;

      // Update collected data view
      const collectedLines = currentItem.Datacollection1.map((d) => {
        return `${d.dataPointName}: ${d.defaultValue ?? "--"}`;
      });

      collectedLines.unshift(`📦 Route Card: ${currentItem.routeCardName}`);
      collectedLines.push(
        `🕓 Collected At: ${formatTimestamp(message.timeStamp + "Z")}`
      );

      setRows(newRows);
      setLastMessage(collectedLines.join("\n"));

      Swal.fire({
        icon: "success",
        title: "Lens Data Captured",
        toast: true,
        timer: 1500,
        position: "top-end",
        showConfirmButton: false,
      });

      // ✅ Find the next route card that still needs capturing
      const nextPendingIndex = newRows.findIndex(
        (item, i) => !item.dataCollected && i !== index
      );

      if (nextPendingIndex !== -1) {
        setCurrentIndexSafe(nextPendingIndex);
        getConnection().invoke(
          "RegisterRouteCard",
          newRows[nextPendingIndex].routeCardId
        );
      } else {
        setStartedSafe(false); // All done
      }
    } catch (err) {
      console.error("Data processing error", err);
    }
  };

  // useEffect(() => {
  //   if (hasConnectedRef.current) return;

  //   hasConnectedRef.current = true;

  //   startConnection()
  //     .then(() => {
  //       setLoading(false);
  //       onLensDataReceived(handleDataReceived);
  //       onRouteCardRegistered((msg) => {
  //         if (msg.success) {
  //           Swal.fire({
  //             icon: "success",
  //             title: msg.message,
  //             toast: true,
  //             position: "top-end",
  //             timer: 2000,
  //             showConfirmButton: false,
  //           });
  //         } else {
  //           Swal.fire({
  //             icon: "error",
  //             title: msg.message,
  //           });
  //         }
  //       });

  //       const firstRouteCardId = childList?.[0]?.routeCardId;
  //       if (firstRouteCardId) {
  //         registerRouteCard(firstRouteCardId);
  //       }
  //     })
  //     .catch((err) => {
  //       Swal.fire({
  //         icon: "error",
  //         title: "SignalR Connection Failed",
  //         text: err.message || "Check backend or refresh the page.",
  //       });
  //       setLoading(false);
  //     });
  // }, []);

  useEffect(() => {
    return () => {
      const connection = getConnection();
      if (connection) {
        connection.stop();
      }
    };
  }, []);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">🔍 Data Collection Panel</Typography>
        <Box>
          <Button
            variant="contained"
            color="success"
            sx={{ mr: 2 }}
            onClick={handleStart}
            disabled={started || loading}
          >
            Start
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleStop}
            disabled={!started}
          >
            Stop
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box display="flex" mt={3}>
          {/* Left grid of route cards */}
          <Box flex={2}>
            <Grid container spacing={2}>
              {rows.map((rc, idx) => {
                const status = rc.dataCollected
                  ? "collected"
                  : idx === currentIndex && started
                  ? "fetching"
                  : "pending";

                return (
                  <Grid item xs={4} key={rc.UniqueId}>
                    <CellBox
                      status={status as any}
                      onClick={(e) => {
                        // prevent if edit icon clicked
                        if ((e.target as HTMLElement).closest(".edit-icon"))
                          return;

                        const selected = rows[idx];
                        const lines = selected.Datacollection1.map(
                          (d) => `${d.dataPointName}: ${d.defaultValue ?? "--"}`
                        );
                        lines.unshift(
                          `📦 Route Card: ${selected.routeCardName}`
                        );
                        lines.push(
                          `🟢 Status: ${
                            selected.dataCollected ? "Collected" : "Pending"
                          }`
                        );
                        setLastMessage(lines.join("\n"));
                      }}
                    >
                      {rc.routeCardName}
                      {/* ✏️ Edit icon (bottom right) */}
                      <Box
                        className="edit-icon"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent parent click
                          const newRows = [...rows];
                          newRows[idx].dataCollected = false;
                          setRows(newRows);
                          setCurrentIndexSafe(idx);
                          getConnection().invoke(
                            "RegisterRouteCard",
                            newRows[idx].routeCardId,
                            machineId
                          );
                          setStartedSafe(true);
                        }}
                        sx={{
                          position: "absolute",
                          bottom: 4,
                          right: 4,
                          cursor: "pointer",
                          fontSize: 14,
                          color: "#555",
                          backgroundColor: "#fff",
                          padding: "2px 4px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      >
                        ✏️
                      </Box>
                    </CellBox>
                  </Grid>
                );
              })}
            </Grid>
          </Box>

          {/* Right pane: last collected data */}
          <Box
            flex={1}
            ml={3}
            p={2}
            border="1px solid #ccc"
            borderRadius={2}
            minHeight={300}
          >
            <Typography variant="h6" gutterBottom>
              🧾 Last Fetched Data
            </Typography>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                fontSize: 14,
                color: "#333",
              }}
            >
              {lastMessage ?? "No data collected yet."}
            </pre>
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default LensDataListener;
