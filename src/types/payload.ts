import {
  BrowserEngineId,
  TimeFormatPreferenceId,
  SpeechApiStatusId,
  BrowserPermissionState,
  PermissionState,
} from "./enums";
import {
  DimensionsMessage,
  TouchCapabilityDetailsMessage,
  EMEKeySystemReport,
} from "./messages";
import { UserAgentBrandVersion } from "./browser-apis";
import {
  StandardizedMediaDeviceInfo,
  StandardizedMediaAccess,
} from "./fingerprint";

export interface ScreenInfo {
  width?: number;
  height?: number;
  availWidth?: number;
  availHeight?: number;
  colorDepth?: number;
  pixelDepth?: number;
  orientation?: string;
  pixelRatio?: number;
  devicePixelRatio?: number;
  dimensionsObj?: any;
  availDimensionsObj?: any;
  screenDpi?: number;
}

export interface WebGLInfo {
  maxViewportDimsObj?: DimensionsMessage;
  maxTextureSize?: number;
  maxTextureImageUnits?: number;
  maxFragmentUniformVectors?: number;
  maxVaryingVectors?: number;
  aliasedPointSizeRangeArr?: { values?: number[] };
  aliasedLineWidthRangeArr?: { values?: number[] };
  unmaskedRenderer?: string;
  vendor?: string;
  renderer?: string;
  fingerprint?: string;
  webgl2Supported?: boolean;
}

export interface BrowserCapabilityInfo {
  hasSessionStorage?: number;
  hasLocalStorage?: number;
  hasIndexedDB?: number;
  cookiesEnabled?: boolean;
  javaEnabled?: boolean;
  hasWebkitRequestFileSystem?: boolean;
  hasOpenDatabase?: boolean;
  hasPromiseAllSettled?: boolean;
  hasMsSaveBlob?: boolean;
}

export interface NavigatorInfo {
  userAgent?: string;
  platform?: string;
  language?: string;
  languages?: string[];
  cookieEnabled?: boolean;
  onLine?: boolean;
  hardwareConcurrency?: number;
  maxTouchPoints?: number;
  msDoNotTrack?: string;
  doNotTrack?: string;
  oscpu?: string;
  vendor?: string;
  vendorSub?: string;
  productSub?: string;
  buildID?: string;
  appCodeName?: string;
  appName?: string;
  appVersion?: string;
  product?: string;
  cpuClass?: string;
  hasServiceWorker?: boolean;
  userAgentData?: {
    brands?: UserAgentBrandVersion[];
    mobile?: boolean;
    platform?: string;
  };
}

// Base interfaces for media device information
export interface BaseMediaDeviceInfoEntry {
  id: string;
  kind: string;
  hasLabel: boolean;
}

export interface MediaDeviceInfoEntry extends BaseMediaDeviceInfoEntry {}

// Base media devices info interface
export interface BaseMediaDevicesInfo {
  devices?: MediaDeviceInfoEntry[];
  microphoneAccess?: string;
  webcamAccess?: string;
  speakerAccess?: string;
}

export interface MediaDevicesInfo extends BaseMediaDevicesInfo {
  standardizedDevices?: StandardizedMediaDeviceInfo[];
  standardizedAccess?: StandardizedMediaAccess;
}

export interface NetworkConnection {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
}

// Base device storage interface
export interface BaseDeviceStorage {
  quota?: number;
  usage?: number;
}

export interface DeviceStorage extends BaseDeviceStorage {
  estimate?: any;
}

export interface EMECapabilitiesSummaryMessage {
  reports?: { [key: string]: EMEKeySystemReport };
  overallStatus?: string;
}

export interface WebGPUInfo {
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
  status?: number;
}

export interface AutomationInfo {
  automationToolDetected?: boolean;
  webdriverChecks?: boolean[];
}

// Base heuristics interface
export interface BaseMobileHeuristics {
  byTouchEvent?: boolean;
  deviceOrientationApiDetected?: boolean;
  specificUserAgentPatternDetected?: boolean;
}

export interface MobileHeuristics extends BaseMobileHeuristics {
  isMobile?: boolean;
  isTablet?: boolean;
  touchCapable?: boolean;
  screenWidth?: number;
  screenHeight?: number;
}

// Base speech voice interface
export interface BaseSpeechVoiceInfo {
  name?: string;
  lang?: string;
  localService?: boolean;
  default?: boolean;
}

export interface SpeechVoiceInfo extends BaseSpeechVoiceInfo {
  voiceURI?: string;
}

// Base permission status interface
export interface BasePermissionStatusInfo {
  name: string;
}

export interface PermissionStatusInfo extends BasePermissionStatusInfo {
  state: BrowserPermissionState | PermissionState;
}

export interface TelemetryPayload {
  fingerprint?: string;
  userAgent?: string;
  language?: string;
  platform?: string;
  timezoneOffsetMinutes?: number;
  screenInfo?: ScreenInfo;
  webglInfo?: WebGLInfo;
  browserCapabilityInfo?: BrowserCapabilityInfo;
  navigatorInfo?: NavigatorInfo;
  mediaDevicesInfo?: MediaDevicesInfo;
  networkConnection?: NetworkConnection;
  deviceStorage?: DeviceStorage;
  webgpuInfo?: WebGPUInfo;
  automationInfo?: AutomationInfo;
  audioFingerprint?: string;
  rectsFingerprint?: number;
  speechApiFingerprint?: SpeechApiStatusId;
  fullscreenApiFingerprint?: number;
  mathFingerprint?: number;
  evalLengthFingerprint?: number;
  mobileHeuristics?: MobileHeuristics;
  storedWebsiteData?: string[];
  adBlockerDetected?: boolean;
  screenResMismatch?: boolean;
  touchCapabilityDetails?: TouchCapabilityDetailsMessage;
  maxTouchPoints?: number;
  installedFonts?: string[];
  documentCookie?: string;
  windowInnerDimensionsObj?: DimensionsMessage;
  bodyClientDimensionsObj?: DimensionsMessage;
  browserOnline?: boolean;
  indexedDbKeys?: string[];
  isIframed?: boolean;
  documentHidden?: boolean;
  jsErrorSignature?: string;
  browserEngineSignature?: BrowserEngineId;
  dateTimeFormatOptions?: string;
  mediaQueryMatches?: string[];
  timeFormatPreference?: TimeFormatPreferenceId;
  supportedVideoAudioCodecs?: string[];
  speechVoices?: SpeechVoiceInfo[];
  canvasImageDataBenchmark?: number;
  zoomLevelHeuristic?: number;
  batteryStatusIssue?: boolean;
  permissionStatuses?: PermissionStatusInfo[];
  webrtcLeakInfo?: string[];
  ontouchstartEventListener?: string;
  ontouchmoveEventListener?: string;
  windowObjectKeys?: string[];
  navigatorObjectKeys?: string[];
  toFixedEngineId?: number;
  userAgentDataBrands?: UserAgentBrandVersion[];
  userAgentDataMobile?: boolean;
  userAgentDataArchitecture?: string;
  userAgentDataBitness?: string;
  userAgentDataModel?: string;
  userAgentDataPlatformVersion?: string;
  userAgentDataFullVersionList?: UserAgentBrandVersion[];
  userAgentDataWow64?: boolean;
  endiannessByte?: number;
  incognitoDetected?: boolean;
  ipqsDeviceId?: string;
}

export type PartialTelemetryData = Partial<TelemetryPayload>;
