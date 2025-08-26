export enum BrowserPermissionState {
  GRANTED = "granted",
  DENIED = "denied",
  PROMPT = "prompt",
}

export enum PermissionState {
  GRANTED = 0,
  DENIED = 1,
  PROMPT = 2,
  UNKNOWN = 3,
}

export enum BrowserEngineId {
  WEBKIT = "webkit",
  BLINK = "blink",
  GECKO = "gecko",
  TRIDENT = "trident",
  EDGE_HTML = "edgehtml",
  CHROME = "chrome",
  FIREFOX = "firefox",
  SAFARI = "safari",
  EDGE = "edge",
  OPERA = "opera",
  BRAVE = "brave",
  UNKNOWN_BROWSER = "unknown",
}

export enum TimeFormatPreferenceId {
  FORMAT_12 = 12,
  FORMAT_24 = 24,
  UNKNOWN = -1,
  TIME_FORMAT_UNKNOWN = 0,
  TIME_FORMAT_12H = 1,
  TIME_FORMAT_24H = 2,
}

export enum SpeechApiStatusId {
  SUPPORTED = 1,
  NOT_SUPPORTED = 0,
  UNKNOWN = -1,
  SPEECH_API_STATUS_NOT_AVAILABLE = 0,
  SPEECH_API_STATUS_UTTERANCE_MISSING = 1,
  SPEECH_API_STATUS_AVAILABLE = 2,
  SPEECH_API_STATUS_ERROR = 3,
}

export enum WebGpuStatusId {
  SUPPORTED = 1,
  NOT_SUPPORTED = 0,
  UNKNOWN = -1,
  WEB_GPU_STATUS_SUCCESS = 0,
  WEB_GPU_STATUS_NOT_AVAILABLE = 1,
  WEB_GPU_STATUS_ADAPTER_REQUEST_FAILED = 2,
  WEB_GPU_STATUS_ADAPTER_INFO_FAILED = 3,
}

export enum DoNotTrackId {
  ENABLED = 1,
  DISABLED = 0,
  UNKNOWN = -1,
  DO_NOT_TRACK_UNSPECIFIED = 0,
  DO_NOT_TRACK_ENABLED = 1,
  DO_NOT_TRACK_DISABLED = 2,
}
