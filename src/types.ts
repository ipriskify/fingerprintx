import { BrowserEngineId } from "./types/enums";

export interface NavigatorExtended extends Navigator {
  cpuClass?: string;
  userLanguage?: string;
  browserLanguage?: string;
  systemLanguage?: string;
  msDoNotTrack?: string;
  deviceMemory?: number;
  connection?: NetworkInformation;
  mozConnection?: NetworkInformation;
  webkitConnection?: NetworkInformation;
  getBattery?: () => Promise<BatteryManager>;
  userAgentData?: UserAgentData;
  requestMediaKeySystemAccess: (
    keySystem: string,
    supportedConfigurations: any[],
  ) => Promise<any>;
  gpu?: GPU;
  msSaveBlob?: any;
  webkitTemporaryStorage?: {
    queryUsageAndQuota: (
      successCallback: (usedBytes: number, grantedBytes: number) => void,
      errorCallback?: (error: any) => void,
    ) => void;
  };
  serviceWorker: ServiceWorkerContainer;
  brave?: {
    isBrave: () => Promise<boolean>;
    [key: string]: any;
  };
}

export interface WindowExtended extends Window {
  doNotTrack?: string;
  webkitRequestFileSystem?: (
    type: number,
    size: number,
    successCallback: (fs: any) => void,
    errorCallback?: (error: Error) => void,
  ) => void;
  openDatabase?: (
    name: string | null,
    version: string | null,
    displayName: string | null,
    estimatedSize: number | null,
    creationCallback?: (db: any) => void,
  ) => any | null;
  _phantom?: any;
  callPhantom?: any;
  Buffer?: any;
  emit?: any;
  spawn?: any;
  awesomium?: any;
  fmget_targets?: any;
  geb?: any;
  __nightmare?: any;
  nightmare?: any;
  __phantomas?: any;
  _Selenium_IDE_Recorder?: any;
  _selenium?: any;
  calledSelenium?: any;
  wdioElectron?: any;
  __webdriverFunc?: any;
  __lastWatirAlert?: any;
  __lastWatirConfirm?: any;
  __lastWatirPrompt?: any;
  _WEBDRIVER_ELEM_CACHE?: any;
  ChromeDriverw?: any;
  domAutomation?: any;
  domAutomationController?: any;
  RunPerfTest?: any;
  CefSharp?: any;
  cdc_adoQpoasnfa76pfcZLmcfl_Array?: any;
  cdc_adoQpoasnfa76pfcZLmcfl_Promise?: any;
  $cdc_asdjflasutopfhvcZLmcfl_Symbol?: any;
  WebGLRenderingContext?: typeof WebGLRenderingContext;
  WebGL2RenderingContext?: typeof WebGL2RenderingContext;
  AudioContext?: typeof AudioContext;
  webkitAudioContext?: typeof AudioContext;
  SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance;
  InstallTrigger?: any;
  chrome?: {
    webstore?: any;
    runtime?: any;
    [key: string]: any;
  };
  StyleMedia?: any;
  opera?: any;
  safari?: any;
}

export enum PermissionState {
  GRANTED = 0,
  DENIED = 1,
  PROMPT = 2,
  UNKNOWN = 3,
}

export enum TimeFormatPreferenceId {
  TIME_FORMAT_UNKNOWN = 0,
  TIME_FORMAT_12H = 1,
  TIME_FORMAT_24H = 2,
}

export enum SpeechApiStatusId {
  SPEECH_API_STATUS_NOT_AVAILABLE = 0,
  SPEECH_API_STATUS_UTTERANCE_MISSING = 1,
  SPEECH_API_STATUS_AVAILABLE = 2,
  SPEECH_API_STATUS_ERROR = 3,
}

export enum WebGpuStatusId {
  WEB_GPU_STATUS_SUCCESS = 0,
  WEB_GPU_STATUS_NOT_AVAILABLE = 1,
  WEB_GPU_STATUS_ADAPTER_REQUEST_FAILED = 2,
  WEB_GPU_STATUS_ADAPTER_INFO_FAILED = 3,
}

export enum DoNotTrackId {
  DO_NOT_TRACK_UNSPECIFIED = 0,
  DO_NOT_TRACK_ENABLED = 1,
  DO_NOT_TRACK_DISABLED = 2,
}

export interface PermissionStatusInfo {
  name: string;
  state: PermissionState;
}

export interface UserAgentBrandVersion {
  brand: string;
  version: string;
}

export interface UserAgentData {
  brands: UserAgentBrandVersion[];
  mobile: boolean;
  platform: string;
  getHighEntropyValues(hints: string[]): Promise<UADataValues>;
}

export interface UADataValues {
  architecture?: string;
  bitness?: string;
  model?: string;
  platformVersion?: string;
  uaFullVersion?: string;
  fullVersionList?: UserAgentBrandVersion[];
  wow64?: boolean;
}

export interface NetworkInformation extends EventTarget {
  readonly downlink?: number;
  readonly effectiveType?: "slow-2g" | "2g" | "3g" | "4g";
  readonly rtt?: number;
  readonly saveData?: boolean;
}

export interface BatteryManager extends EventTarget {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
}

export type MediaKeySystemConfiguration = any;
export type MediaKeyCapability = any;
export type MediaKeysRequirement = any;

export interface MediaKeySystemAccess {
  readonly keySystem: string;
  getConfiguration(): MediaKeySystemConfiguration;
  createMediaKeys(): Promise<MediaKeys>;
}

export interface MediaKeys {}

export interface GPU {
  requestAdapter(
    options?: GPURequestAdapterOptions,
  ): Promise<GPUAdapter | null>;
}

export interface GPURequestAdapterOptions {
  powerPreference?: GPUPowerPreference;
  forceFallbackAdapter?: boolean;
}

export type GPUPowerPreference = "low-power" | "high-performance";

export interface GPUAdapter {
  readonly features: GPUSupportedFeatures;
  readonly limits: GPUSupportedLimits;
  readonly isFallbackAdapter: boolean;
  requestDeviceInfo(): Promise<GPUAdapterInfo>;
  requestAdapterInfo(): Promise<GPUAdapterInfo>;
}

export interface GPUAdapterInfo {
  vendor: string;
  architecture: string;
  device: string;
  description: string;
}

export interface GPUSupportedFeatures extends ReadonlySet<string> {}

export interface GPUSupportedLimits extends Record<string, number> {}

export interface DimensionsMessage {
  width: number;
  height: number;
}

export interface OptionalDimensionsMessage {
  width?: number;
  height?: number;
}

export interface FloatArrayMessage {
  values?: number[];
}

export interface TouchCapabilityDetailsMessage {
  maxTouchPoints: number;
  touchEvent: boolean;
  touchStart: boolean;
  maxPoints?: number;
  touchApiSupported?: boolean;
  touchEventSupported?: boolean;
}

export interface PluginEntryMessage {
  name?: string;
  description?: string;
  filename?: string;
}

export interface EMEIdentifierReport {
  supportedSchemes?: string[];
  errorMessage?: string;
}

export interface EMEKeySystemReport {
  identifierReports?: { [key: string]: EMEIdentifierReport };
  overallStatusMessage?: string;
}

export interface EMECapabilitiesSummaryMessage {
  reports?: { [key: string]: EMEKeySystemReport };
  globalError?: string;
}

export interface ScreenInfo {
  dimensionsObj?: DimensionsMessage;
  availDimensionsObj?: DimensionsMessage;
  colorDepth?: number;
  devicePixelRatio?: number;
  screenDpi?: number;
}

export interface WebGLInfo {
  maxViewportDimsObj?: DimensionsMessage;
  maxTextureSize?: number;
  maxTextureImageUnits?: number;
  maxFragmentUniformVectors?: number;
  maxVaryingVectors?: number;
  aliasedPointSizeRangeArr?: FloatArrayMessage;
  aliasedLineWidthRangeArr?: FloatArrayMessage;
  unmaskedRenderer?: string;
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
  hardwareConcurrency?: number;
  cpuClass?: string;
  doNotTrack?: DoNotTrackId;
  pluginEntries?: PluginEntryMessage[];
  languages?: string[];
  languageMismatch?: boolean;
  deviceMemory?: number;
  jsHeapSizeLimit?: number;
  webkitTemporaryStorageQuota?: number;
  hasServiceWorker?: boolean;
}

export interface MediaDeviceInfoEntry {
  id?: string;
  kind?: string;
  hasLabel?: boolean;
}

export interface MediaDevicesInfo {
  devices?: MediaDeviceInfoEntry[];
  microphoneAccess?: string;
  webcamAccess?: string;
  speakerAccess?: string;
}

export interface NetworkConnection {
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
  saveData?: boolean;
}

export interface DeviceStorage {
  quota?: number;
  usage?: number;
  error?: string;
}

export interface WebGPUInfo {
  status?: WebGpuStatusId;
  vendor?: string;
  architecture?: string;
  device?: string;
  description?: string;
}

export interface AutomationInfo {
  automationToolDetected?: boolean;
  webdriverChecks?: boolean[];
}

export interface MobileHeuristics {
  specificUserAgentPatternDetected?: boolean;
  deviceOrientationApiDetected?: boolean;
  byTouchEvent?: boolean;
}

export interface SpeechVoiceInfo {
  name: string;
  lang: string;
  default: boolean;
  localService: boolean;
  voiceURI: string;
}

export interface TelemetryPayload {
  ipqsDeviceId?: string;
  visitorId?: string;
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
}

export type PartialTelemetryData = Partial<TelemetryPayload>;
