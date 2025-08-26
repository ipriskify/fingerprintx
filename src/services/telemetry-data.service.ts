import { TelemetryPayload, PartialTelemetryData } from "../types";
import { generateRandomHex, getArchitecture } from "../utils";
import { getConfig, TelemetryConfig } from "../config";
import {
  CollectorRegistry,
  ICollector,
  CollectorResult,
  UserAgentCollector,
  ScreenCollector,
  BrowserCapabilitiesCollector,
  BrowserIdentityCollector,
  WebGLCollector,
  AudioFingerprintCollector,
  MediaDevicesCollector,
  SpeechSynthesisCollector,
  AutomationDetectionCollector,
  PrivateModeDetectionCollector,
  BatteryCollector,
  PerformanceCollector,
} from "../collectors";

export class TelemetryDataService {
  private registry: CollectorRegistry;
  private config: TelemetryConfig;

  constructor() {
    this.registry = CollectorRegistry.getInstance();
    this.config = getConfig();
    this.registerDefaultCollectors();
  }

  private registerDefaultCollectors(): void {
    this.registry.clear();

    const collectors = [
      new UserAgentCollector(),
      new ScreenCollector(),
      new BrowserCapabilitiesCollector(),
      new BrowserIdentityCollector(),
      new WebGLCollector(),
      new AudioFingerprintCollector(),
      new MediaDevicesCollector(),
      new SpeechSynthesisCollector(),
      new AutomationDetectionCollector(),
      new PrivateModeDetectionCollector(),
      new BatteryCollector(),
      new PerformanceCollector(),
    ];

    collectors.forEach((collector) => {
      this.registry.register(collector);
    });
  }

  private initializeBasePayload(deviceIdLength: number): PartialTelemetryData {
    return {
      storedWebsiteData: [],
      indexedDbKeys: [],
      endiannessByte: getArchitecture(),
      incognitoDetected: false,
    };
  }

  async collectTelemetryData(deviceIdLength = 32): Promise<TelemetryPayload> {
    const payload = this.initializeBasePayload(deviceIdLength);

    try {
      const supportedCollectors = this.registry.getSupported();
      const sortedCollectors = this.registry
        .getSorted()
        .filter((c) => supportedCollectors.includes(c));

      if (this.config.enableLogging) {
        console.log(
          `Running ${sortedCollectors.length} supported collectors...`,
        );
      }

      const results = await Promise.allSettled(
        sortedCollectors.map(async (collector) => {
          if (this.config.enableLogging) {
            console.log(`Running collector: ${collector.metadata.id}`);
          }
          return {
            id: collector.metadata.id,
            result: await collector.collect(),
          };
        }),
      );

      results.forEach((promiseResult) => {
        if (promiseResult.status === "fulfilled") {
          const { id, result } = promiseResult.value;

          if (result.success && result.data) {
            Object.assign(payload, result.data);
            if (this.config.enableLogging) {
              console.log(`✓ ${id}: ${result.executionTime?.toFixed(2)}ms`);
            }
          } else {
            if (this.config.enableLogging) {
              console.warn(`✗ ${id}: ${result.error}`);
            }
          }
        } else {
          if (this.config.enableLogging) {
            console.error("Collector promise rejected:", promiseResult.reason);
          }
        }
      });

      return payload as TelemetryPayload;
    } catch (error) {
      if (this.config.enableLogging) {
        console.error("Error collecting telemetry data:", error);
      }
      throw error;
    }
  }

  addCollector(collector: ICollector): void {
    this.registry.register(collector);
  }

  removeCollector(id: string): boolean {
    return this.registry.unregister(id);
  }

  getCollector(id: string): ICollector | undefined {
    return this.registry.get(id);
  }

  getAllCollectors(): ICollector[] {
    return this.registry.getAll();
  }

  getSupportedCollectors(): ICollector[] {
    return this.registry.getSupported();
  }

  getCollectorStats(): {
    total: number;
    supported: number;
    byCategory: Record<string, number>;
  } {
    const all = this.registry.getAll();
    const supported = this.registry.getSupported();

    const byCategory = all.reduce(
      (acc, collector) => {
        const category = collector.metadata.category;
        acc[category] = (acc[category] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>,
    );

    return {
      total: all.length,
      supported: supported.length,
      byCategory,
    };
  }
}
