import "./polyfills";
import { TelemetryPayload } from "./types";
import { calculateVisitorIdInternal } from "./payload_handler";
import {
  TelemetryDataService,
  NetworkService,
  TelemetryResponse,
} from "./services";
import { getConfig, updateConfig } from "./config";
import type { TelemetryConfig } from "./config";

export class TelemetryClient {
  private dataService: TelemetryDataService;
  private networkService: NetworkService;
  private config: TelemetryConfig;

  constructor(customConfig?: Partial<TelemetryConfig>) {
    if (customConfig) {
      updateConfig(customConfig);
    }

    const configFromGetConfig: TelemetryConfig = getConfig();
    this.config = configFromGetConfig;
    this.dataService = new TelemetryDataService();
    this.networkService = new NetworkService(this.config);
  }

  updateConfiguration(newConfig: Partial<TelemetryConfig>): void {
    updateConfig(newConfig);
    this.config = getConfig();
    this.networkService.updateConfig(this.config);
  }

  async collectDataOnly(): Promise<TelemetryPayload | null> {
    try {
      const payload = await this.dataService.collectTelemetryData(32);

      const visitorId = await calculateVisitorIdInternal(payload);
      payload.visitorId = visitorId;

      return payload;
    } catch (error) {
      if (this.config.enableLogging) {
        console.error("Error collecting data:", error);
      }
      return null;
    }
  }

  getCollectorStats(): {
    total: number;
    supported: number;
    byCategory: Record<string, number>;
  } {
    return this.dataService.getCollectorStats();
  }
}
