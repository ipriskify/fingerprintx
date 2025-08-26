import { PartialTelemetryData } from "../../types";

export const COLLECTOR_TIMEOUTS = {
  CRITICAL: 1500,
  HIGH: 2500,
  MEDIUM: 4000,
  LOW: 6000,
  OPTIONAL: 8000,
} as const;

export const COLLECTOR_IDS = {
  USER_AGENT: "user-agent",
  SCREEN_INFO: "screen-info",
  BROWSER_CAPABILITIES: "browser-capabilities",
  BROWSER_IDENTITY: "browser-identity",
  BROWSER_FEATURES: "browser-features",
  MEDIA_DEVICES: "media-devices",
  SPEECH_SYNTHESIS: "speech-synthesis",
  SYSTEM_BATTERY: "system-battery",
  SYSTEM_INFO: "system-info",
  WEBGL: "webgl-fingerprint",
  FONT_FINGERPRINT: "font-fingerprint",
  AUDIO_FINGERPRINT: "audio-fingerprint",
  CLIENT_RECTS_FINGERPRINT: "client-rects-fingerprint",
  FULLSCREEN_API_FINGERPRINT: "fullscreen-api-fingerprint",
  MATH_FINGERPRINT: "math-fingerprint",
  EVAL_LENGTH_FINGERPRINT: "eval-length-fingerprint",
  TOUCH_CAPABILITY: "touch-capability",
  CANVAS: "canvas",
  CANVAS_PERFORMANCE: "canvas-performance",
} as const;

export interface CollectorMetadata {
  id: string;
  category: CollectorCategory;
  priority: CollectorPriority;
  timeout?: number;
  retries?: number;
  dependencies?: string[];
}

export enum CollectorCategory {
  DEVICE = "device",
  BROWSER = "browser",
  FINGERPRINTING = "fingerprinting",
  MEDIA = "media",
  SECURITY = "security",
  SYSTEM = "system",
  NETWORK = "network",
  PERFORMANCE = "performance",
}

export enum CollectorPriority {
  CRITICAL = 1,
  HIGH = 2,
  MEDIUM = 3,
  LOW = 4,
  OPTIONAL = 5,
}

export interface CollectorResult<T = PartialTelemetryData> {
  success: boolean;
  data?: T;
  error?: string;
  executionTime?: number;
  metadata?: Record<string, any>;
}

export interface ICollector<T = PartialTelemetryData> {
  readonly metadata: CollectorMetadata;

  isSupported(): boolean;

  collect(): Promise<CollectorResult<T>>;

  validate?(data: T): boolean;

  transform?(data: T): T;
}
