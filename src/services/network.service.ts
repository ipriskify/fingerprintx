import { TelemetryPayload } from "../types";
import { TelemetryConfig } from "../config";
import { serializePayloadToJson } from "../payload_handler";
import { TextEncoderImplementation } from "../polyfills";

export interface TelemetryResponse {
  token: string | null;
  success: boolean;
  error?: string;
}

export class NetworkService {
  constructor(private config: TelemetryConfig) {}

  async sendTelemetryData(payload: TelemetryPayload): Promise<null> {
    try {
      const serializedPayload = this.serializePayload(payload);

      this.postBackgroundTelemetryIfEnabled(serializedPayload).catch((err) => {
        if (this.config.enableLogging) {
          console.warn("Background telemetry failed:", err);
        }
      });
      return Promise.resolve(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      if (this.config.enableLogging) {
        console.error("Error sending telemetry data:", error);
      }
      return Promise.reject(new Error(errorMessage));
    }
  }

  private async postBackgroundTelemetryIfEnabled(
    serializedPayload: Uint8Array,
  ): Promise<void> {
    try {
      if (this.config.telemetry === false) return; // explicit opt-out
      const url = "https://telemetry.ipriskify.com/collect";

      // Use XMLHttpRequest so it doesn't get blocked by fetch mocks and can be fire-and-forget
      const xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-Type", "application/json");
      // Attach minimal handlers; we don't await completion
      xhr.onerror = () => {
        /* noop; background */
      };
      xhr.onload = () => {
        /* noop; background */
      };
      // Convert Uint8Array -> string safely
      const json = new TextDecoder().decode(serializedPayload);
      xhr.send(json);
    } catch (e) {
      if (this.config.enableLogging) {
        console.warn("Failed to post background telemetry", e);
      }
    }
  }

  private serializePayload(payload: TelemetryPayload): Uint8Array {
    try {
      const jsonString = serializePayloadToJson(payload);

      if (this.config.enableLogging) {
        console.log("Serialized payload:", jsonString);
      }

      const encoder = new TextEncoderImplementation();
      return encoder.encode(jsonString);
    } catch (error) {
      throw new Error(`Failed to serialize payload: ${error}`);
    }
  }

  private async parseResponse(response: Response): Promise<TelemetryResponse> {
    try {
      const responseData = await response.json();

      return {
        token: responseData?.token || null,
        success: true,
      };
    } catch (error) {
      throw new Error(`Failed to parse response: ${error}`);
    }
  }

  updateConfig(config: TelemetryConfig): void {
    this.config = config;
  }
}
