import axios from "axios";
import { getSessionToken } from "../components/AuthUser";
import { api } from "../components/API/apiConfig";

export function PowerBIData(msltoken) {
  const body = {
    datasets: [
      {
        id: "5ae250ed-efae-438a-a760-8f2420fa77f7",
      },
    ],
    reports: [
      {
        id: "fe50bae6-3c52-4793-8fa4-a5f56a4f4aa0",
      },
    ],
  };
  const powerapi = axios.create({
    baseURL: "https://api.powerbi.com/v1.0",
  });

  return powerapi.post("/myorg/GenerateToken", body, {
    headers: {
      Authorization: `Bearer ${msltoken}`,
    },
  });
}
export function PowerBiToken() {
  const accessToken = getSessionToken();
  return api.get("api/powerbi/api/PowerBitoken", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}
