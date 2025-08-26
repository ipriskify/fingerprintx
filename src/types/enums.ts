export enum BrowserPermissionState {
  GRANTED = "granted",
  DENIED = "denied",
  PROMPT = "prompt",
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
}

export enum SpeechApiStatusId {
  SUPPORTED = 1,
  NOT_SUPPORTED = 0,
  UNKNOWN = -1,
}

export enum WebGpuStatusId {
  SUPPORTED = 1,
  NOT_SUPPORTED = 0,
  UNKNOWN = -1,
}

export enum DoNotTrackId {
  ENABLED = 1,
  DISABLED = 0,
  UNKNOWN = -1,
}
