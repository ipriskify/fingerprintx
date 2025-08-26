import {
  ICollector,
  CollectorMetadata,
  CollectorResult,
  COLLECTOR_TIMEOUTS,
  CollectorPriority,
} from "./collector.interface";
import { PartialTelemetryData } from "../../types";

export abstract class BaseCollector<T = PartialTelemetryData>
  implements ICollector<T>
{
  public readonly metadata: CollectorMetadata;

  constructor(metadata: CollectorMetadata) {
    this.metadata = metadata;
  }

  abstract isSupported(): boolean;
  protected abstract doCollect(): Promise<T>;

  async collect(): Promise<CollectorResult<T>> {
    const startTime = performance.now();

    try {
      if (!this.isSupported()) {
        return {
          success: false,
          error: `Collector ${this.metadata.id} is not supported in this environment`,
          executionTime: performance.now() - startTime,
        };
      }

      const data = await this.executeWithTimeout();
      const transformedData = this.transform ? this.transform(data) : data;

      if (this.validate && !this.validate(transformedData)) {
        return {
          success: false,
          error: `Data validation failed for collector ${this.metadata.id}`,
          executionTime: performance.now() - startTime,
        };
      }

      return {
        success: true,
        data: transformedData,
        executionTime: performance.now() - startTime,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        executionTime: performance.now() - startTime,
      };
    }
  }

  private async executeWithTimeout(): Promise<T> {
    const defaultTimeout = this.getDefaultTimeoutForPriority(
      this.metadata.priority,
    );
    const timeout = this.metadata.timeout || defaultTimeout;

    return Promise.race([
      this.doCollect(),
      new Promise<never>((_, reject) =>
        setTimeout(
          () => reject(new Error(`Timeout after ${timeout}ms`)),
          timeout,
        ),
      ),
    ]);
  }

  private getDefaultTimeoutForPriority(priority: CollectorPriority): number {
    switch (priority) {
      case CollectorPriority.CRITICAL:
        return COLLECTOR_TIMEOUTS.CRITICAL;
      case CollectorPriority.HIGH:
        return COLLECTOR_TIMEOUTS.HIGH;
      case CollectorPriority.MEDIUM:
        return COLLECTOR_TIMEOUTS.MEDIUM;
      case CollectorPriority.LOW:
        return COLLECTOR_TIMEOUTS.LOW;
      case CollectorPriority.OPTIONAL:
        return COLLECTOR_TIMEOUTS.OPTIONAL;
      default:
        return COLLECTOR_TIMEOUTS.MEDIUM;
    }
  }

  protected safeExecute<R>(fn: () => R, fallback: R): R {
    try {
      return fn();
    } catch {
      return fallback;
    }
  }

  protected async safeExecuteAsync<R>(
    fn: () => Promise<R>,
    fallback: R,
  ): Promise<R> {
    try {
      return await fn();
    } catch {
      return fallback;
    }
  }

  protected validateDataStructure(
    data: any,
    requiredFields: string[],
  ): boolean {
    if (!data || typeof data !== "object") {
      return false;
    }

    return requiredFields.every((field) => {
      const value = this.getNestedProperty(data, field);
      return value !== undefined && value !== null;
    });
  }

  private getNestedProperty(obj: any, path: string): any {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  }

  validate?(data: T): boolean;
  transform?(data: T): T;
}
