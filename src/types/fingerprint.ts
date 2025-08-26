export enum MediaDeviceAccessLevel {
  LABELED = "labeled",
  UNLABELED = "unlabeled",
  NONE = "none",
  ERROR = "error",
  UNSUPPORTED = "unsupported",
}

export enum MediaDevicePresence {
  PRESENT = "present",
  NOT_PRESENT = "not_present",
  ERROR = "error",
  UNSUPPORTED = "unsupported",
}

export enum MediaDeviceKind {
  AUDIO_INPUT = "audioinput",
  VIDEO_INPUT = "videoinput",
  AUDIO_OUTPUT = "audiooutput",
  ERROR = "error",
  UNKNOWN = "unknown",
}

export enum BrowserEngine {
  WEBKIT = "webkit",
  BLINK = "blink",
  GECKO = "gecko",
  EDGE_HTML = "edgehtml",
  TRIDENT = "trident",
  UNKNOWN = "unknown",
}

export enum PlatformType {
  WINDOWS = "windows",
  MACOS = "macos",
  LINUX = "linux",
  ANDROID = "android",
  IOS = "ios",
  UNKNOWN = "unknown",
}

export enum WebGLVendor {
  NVIDIA = "nvidia",
  AMD = "amd",
  INTEL = "intel",
  APPLE = "apple",
  QUALCOMM = "qualcomm",
  ARM = "arm",
  SOFTWARE = "software",
  UNKNOWN = "unknown",
}

export enum CapabilityStatus {
  SUPPORTED = "supported",
  UNSUPPORTED = "unsupported",
  ERROR = "error",
  UNKNOWN = "unknown",
}

export enum ScreenOrientationType {
  PORTRAIT_PRIMARY = "portrait-primary",
  PORTRAIT_SECONDARY = "portrait-secondary",
  LANDSCAPE_PRIMARY = "landscape-primary",
  LANDSCAPE_SECONDARY = "landscape-secondary",
  UNKNOWN = "unknown",
}

export interface StandardizedMediaDeviceInfo {
  id: string;
  kind: MediaDeviceKind;
  hasLabel: boolean;
  groupId?: string;
}

export interface StandardizedMediaAccess {
  microphone: MediaDeviceAccessLevel;
  camera: MediaDeviceAccessLevel;
  speaker: MediaDevicePresence;
  timestamp: number;
}

export interface StandardizedWebGLInfo {
  vendor: WebGLVendor;
  renderer: string;
  version: string;
  shadingLanguageVersion: string;
  extensions: string[];
  maxTextureSize: number;
  maxViewportDims: [number, number];
}

export interface StandardizedScreenInfo {
  width: number;
  height: number;
  availWidth: number;
  availHeight: number;
  colorDepth: number;
  pixelDepth: number;
  orientation: ScreenOrientationType;
  pixelRatio: number;
}

export interface StandardizedBrowserCapabilities {
  localStorage: CapabilityStatus;
  sessionStorage: CapabilityStatus;
  indexedDB: CapabilityStatus;
  webGL: CapabilityStatus;
  webGL2: CapabilityStatus;
  cookiesEnabled: boolean;
  javaEnabled: boolean;
}

export interface StandardizedPlatformInfo {
  type: PlatformType;
  version: string;
  architecture: string;
}

export interface FingerprintMetadata {
  collectionTimestamp: number;
  collectorVersion: string;
  sessionId: string;
  reliability: number;
}

export class FingerprintDataUtils {
  static determineMediaAccessLevel(
    devices: MediaDeviceInfo[],
    kind: string,
  ): MediaDeviceAccessLevel {
    try {
      const relevantDevices = devices.filter((device) => device.kind === kind);

      if (relevantDevices.length === 0) {
        return MediaDeviceAccessLevel.NONE;
      }

      const hasLabeledDevice = relevantDevices.some(
        (device) => device.label && device.label.trim() !== "",
      );
      return hasLabeledDevice
        ? MediaDeviceAccessLevel.LABELED
        : MediaDeviceAccessLevel.UNLABELED;
    } catch (error) {
      return MediaDeviceAccessLevel.ERROR;
    }
  }

  static normalizeWebGLVendor(vendorString: string): WebGLVendor {
    const vendor = vendorString.toLowerCase();

    if (vendor.includes("nvidia")) return WebGLVendor.NVIDIA;
    if (vendor.includes("amd") || vendor.includes("radeon"))
      return WebGLVendor.AMD;
    if (vendor.includes("intel")) return WebGLVendor.INTEL;
    if (vendor.includes("apple")) return WebGLVendor.APPLE;
    if (vendor.includes("qualcomm") || vendor.includes("adreno"))
      return WebGLVendor.QUALCOMM;
    if (vendor.includes("arm") || vendor.includes("mali"))
      return WebGLVendor.ARM;
    if (vendor.includes("software") || vendor.includes("mesa"))
      return WebGLVendor.SOFTWARE;

    return WebGLVendor.UNKNOWN;
  }

  static detectPlatformType(userAgent: string): PlatformType {
    const ua = userAgent.toLowerCase();

    if (ua.includes("windows")) return PlatformType.WINDOWS;
    if (ua.includes("mac os") || ua.includes("macos"))
      return PlatformType.MACOS;
    if (ua.includes("linux")) return PlatformType.LINUX;
    if (ua.includes("iphone") || ua.includes("ipad") || ua.includes("ipod"))
      return PlatformType.IOS;
    if (ua.includes("android")) return PlatformType.ANDROID;

    return PlatformType.UNKNOWN;
  }

  static createMetadata(
    collectorId: string,
    sessionId: string,
  ): FingerprintMetadata {
    return {
      collectionTimestamp: Date.now(),
      collectorVersion: "1.0.0",
      sessionId,
      reliability: 0.8,
    };
  }
}
