// src/services/signalRService.ts
import * as signalR from "@microsoft/signalr";

interface StepMeasurementData {
  currentStep: number;
  stepValues: number[];
  liveX: number;
  liveY: number;
}

class SignalRService {
  private connection: signalR.HubConnection;
  private onReceiveCallback: ((data: StepMeasurementData) => void) | null =
    null;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://192.168.1.101:8068/lensHub")
      .withAutomaticReconnect()
      .build();
  }

  async start() {
    if (this.connection.state === signalR.HubConnectionState.Disconnected) {
      await this.connection.start();
    }

    this.connection.on("SendMeasurement", (data: StepMeasurementData) => {
      if (this.onReceiveCallback) {
        this.onReceiveCallback(data);
      }
    });
  }

  onReceiveMeasurement(callback: (data: StepMeasurementData) => void) {
    this.onReceiveCallback = callback;
  }

  startMeasurement() {
    this.connection.invoke("StartMeasurement");
  }

  stopMeasurement() {
    this.connection.invoke("StopMeasurement");
  }

  resetStep(step: number) {
    if (step >= 1 && step <= 5) {
      this.connection.invoke("ResetStep", step);
    } else {
      console.warn(`Invalid step: ${step}`);
    }
  }

  resetAll() {
    this.connection.invoke("ResetAll");
  }
}

export const signalRService = new SignalRService();
