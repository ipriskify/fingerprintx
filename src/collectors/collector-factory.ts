import {
  BaseCollector,
  ICollector,
  CollectorMetadata,
  CollectorCategory,
  CollectorPriority,
  CollectorResult,
} from "./base";
import { PartialTelemetryData } from "../types";

export interface SimpleCollectorConfig {
  id: string;
  category: CollectorCategory;
  priority?: CollectorPriority;
  timeout?: number;
  supportCheck?: () => boolean;
  dataCollector: () => Promise<any>;
  validator?: (data: any) => boolean;
  transformer?: (data: any) => any;
}

export class CollectorFactory {
  static createSimpleCollector(config: SimpleCollectorConfig): ICollector {
    return new SimpleCollector(
      {
        id: config.id,
        category: config.category,
        priority: config.priority || CollectorPriority.MEDIUM,
        timeout: config.timeout || 5000,
      },
      config,
    );
  }

  static createCustomCollector<T = PartialTelemetryData>(
    metadata: CollectorMetadata,
    implementation: {
      isSupported: () => boolean;
      collect: () => Promise<T>;
      validate?: (data: T) => boolean;
      transform?: (data: T) => T;
    },
  ): ICollector<T> {
    return new CustomCollector(metadata, implementation);
  }
}

class SimpleCollector extends BaseCollector {
  private config: SimpleCollectorConfig;

  constructor(metadata: CollectorMetadata, config: SimpleCollectorConfig) {
    super(metadata);
    this.config = config;
  }

  isSupported(): boolean {
    return this.config.supportCheck ? this.config.supportCheck() : true;
  }

  protected async doCollect(): Promise<any> {
    return this.config.dataCollector();
  }

  validate(data: any): boolean {
    return this.config.validator ? this.config.validator(data) : true;
  }

  transform(data: any): any {
    return this.config.transformer ? this.config.transformer(data) : data;
  }
}

class CustomCollector<T> implements ICollector<T> {
  public readonly metadata: CollectorMetadata;
  private implementation: {
    isSupported: () => boolean;
    collect: () => Promise<T>;
    validate?: (data: T) => boolean;
    transform?: (data: T) => T;
  };

  constructor(
    metadata: CollectorMetadata,
    implementation: {
      isSupported: () => boolean;
      collect: () => Promise<T>;
      validate?: (data: T) => boolean;
      transform?: (data: T) => T;
    },
  ) {
    this.metadata = metadata;
    this.implementation = implementation;
  }

  isSupported(): boolean {
    return this.implementation.isSupported();
  }

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

      const data = await this.implementation.collect();
      const transformedData = this.implementation.transform
        ? this.implementation.transform(data)
        : data;

      if (
        this.implementation.validate &&
        !this.implementation.validate(transformedData)
      ) {
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

  validate?(data: T): boolean {
    return this.implementation.validate
      ? this.implementation.validate(data)
      : true;
  }

  transform?(data: T): T {
    return this.implementation.transform
      ? this.implementation.transform(data)
      : data;
  }
}
