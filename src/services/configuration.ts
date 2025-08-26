export interface ConfigurationOptions {
  apiEndpoint?: string;
  timeout?: number;
  retryAttempts?: number;
  enableLogging?: boolean;
  encryptionEnabled?: boolean;
}

export class ConfigurationService {
  private static instance: ConfigurationService;
  private config: Required<ConfigurationOptions>;

  private constructor() {
    this.config = {
      apiEndpoint: "https://api.example.com/telemetry",
      timeout: 5000,
      retryAttempts: 3,
      enableLogging: false,
      encryptionEnabled: true,
    };
  }

  static getInstance(): ConfigurationService {
    if (!ConfigurationService.instance) {
      ConfigurationService.instance = new ConfigurationService();
    }
    return ConfigurationService.instance;
  }

  updateConfig(options: ConfigurationOptions): void {
    this.config = { ...this.config, ...options };
  }

  getConfig(): Required<ConfigurationOptions> {
    return { ...this.config };
  }

  get apiEndpoint(): string {
    return this.config.apiEndpoint;
  }

  get timeout(): number {
    return this.config.timeout;
  }

  get retryAttempts(): number {
    return this.config.retryAttempts;
  }

  get enableLogging(): boolean {
    return this.config.enableLogging;
  }

  get encryptionEnabled(): boolean {
    return this.config.encryptionEnabled;
  }
}
