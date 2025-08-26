import { TEA_DEFAULT_KEY } from "../constants";

export interface TelemetryConfig {
  gatewayUrl: string;
  encryptionKey: [number, number, number, number];
  deviceIdLength: number;
  enableLogging: boolean;
  // When true (default), also post anonymized payload to a background telemetry endpoint via XHR
  telemetry?: boolean;
}

export const DEFAULT_CONFIG: TelemetryConfig = {
  gatewayUrl: "http://localhost:8888/gateway",
  encryptionKey: TEA_DEFAULT_KEY,
  deviceIdLength: 32,
  enableLogging: false,
  telemetry: true,
};

let currentConfig: TelemetryConfig = { ...DEFAULT_CONFIG };

export function getConfig(): TelemetryConfig {
  return currentConfig;
}

export function updateConfig(partialConfig: Partial<TelemetryConfig>): void {
  currentConfig = { ...currentConfig, ...partialConfig };
}

export function resetConfig(): void {
  currentConfig = { ...DEFAULT_CONFIG };
}
