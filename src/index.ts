import { TelemetryClient } from "./core";
import type { TelemetryConfig } from "./config";
import type { TelemetryPayload } from "./types";
import { BrowserEngineId } from "./types/enums";

// Lightweight public API to match CDN usage pattern:
// const fpPromise = import('https://cdn.ipriskify.com/v1/lite')
//   .then(IPRiskifyClient => IPRiskifyClient.load())
// fpPromise.then(fp => fp.get()).then(result => { ... })

export interface FingerprintAnalysisBrowserInfo {
  name: string;
  major_version: string;
  full_version: string;
  os: string;
  os_version: string;
  device: string;
  user_agent: string;
}

export interface FingerprintAnalysis {
  fingerprint: string;
  browser: FingerprintAnalysisBrowserInfo;
  incognito: boolean;
  bot_detected: boolean;
}

export interface FingerprintResult {
  analysis: FingerprintAnalysis;
  fingerprint: TelemetryPayload;
}

function parseBrowserFromUA(
  ua: string,
  engine?: BrowserEngineId,
): { name: string; full_version: string; major_version: string } {
  const val = (s?: string) => (s ? s : "");
  const result = { name: "Unknown", full_version: "", major_version: "" };
  const m = (re: RegExp) => ua.match(re);

  const setVersion = (ver?: string) => {
    const fv = val(ver);
    const major = fv.split(".")[0] || "";
    return { full_version: fv, major_version: major };
  };

  // Prefer engine hint for naming
  if (engine) {
    switch (engine) {
      case BrowserEngineId.BRAVE:
        result.name = "Brave";
        break;
      case BrowserEngineId.CHROME:
        result.name = "Chrome";
        break;
      case BrowserEngineId.FIREFOX:
        result.name = "Firefox";
        break;
      case BrowserEngineId.SAFARI:
        result.name = "Safari";
        break;
      case BrowserEngineId.EDGE:
        result.name = "Edge";
        break;
      case BrowserEngineId.OPERA:
        result.name = "Opera";
        break;
      default:
        break;
    }
  }

  // Version extraction from UA
  if (ua.includes("Edg/")) {
    const mm = m(/Edg\/([\d\.]+)/);
    Object.assign(result, { name: "Edge" }, setVersion(mm?.[1]));
  } else if (ua.includes("OPR/")) {
    const mm = m(/OPR\/([\d\.]+)/);
    Object.assign(result, { name: "Opera" }, setVersion(mm?.[1]));
  } else if (ua.includes("Firefox/")) {
    const mm = m(/Firefox\/([\d\.]+)/);
    Object.assign(result, { name: "Firefox" }, setVersion(mm?.[1]));
  } else if (
    ua.includes("Chrome/") &&
    !ua.includes("OPR/") &&
    !ua.includes("Edg/")
  ) {
    const mm = m(/Chrome\/([\d\.]+)/);
    // If engine hinted Brave, keep name Brave
    const name = engine === BrowserEngineId.BRAVE ? "Brave" : "Chrome";
    Object.assign(result, { name }, setVersion(mm?.[1]));
  } else if (ua.includes("Safari/") && ua.includes("Version/")) {
    const mm = m(/Version\/([\d\.]+)/);
    Object.assign(result, { name: "Safari" }, setVersion(mm?.[1]));
  } else if (ua.includes("MSIE ") || ua.includes("Trident/")) {
    const mm = m(/(?:MSIE |rv:)([\d\.]+)/);
    Object.assign(result, { name: "Internet Explorer" }, setVersion(mm?.[1]));
  }

  return result;
}

function parseOSFromUA(ua: string): {
  os: string;
  os_version: string;
  device: string;
} {
  let os = "Unknown";
  let os_version = "";
  let device = /Mobile|Android|iPhone|iPad|iPod/i.test(ua) ? "Mobile" : "Other";

  const mac = ua.match(/Mac OS X ([\d_]+)/);
  if (mac) {
    os = "Mac OS X";
    os_version = mac[1].replace(/_/g, ".");
  }
  const win = ua.match(/Windows NT ([\d\.]+)/);
  if (win) {
    os = "Windows";
    os_version = win[1];
  }
  const ios = ua.match(/iPhone OS ([\d_]+)/) || ua.match(/CPU OS ([\d_]+)/);
  if (ios) {
    os = "iOS";
    os_version = ios[1].replace(/_/g, ".");
    device = "Mobile";
  }
  const android = ua.match(/Android ([\d\.]+)/);
  if (android) {
    os = "Android";
    os_version = android[1];
    device = "Mobile";
  }
  if (/Linux/.test(ua) && os === "Unknown") {
    os = "Linux";
  }

  return { os, os_version, device };
}

export interface LiteInstance {
  get(): Promise<FingerprintResult>;
}

export async function load(
  customConfig?: Partial<TelemetryConfig>,
): Promise<LiteInstance> {
  const client = new TelemetryClient(customConfig);
  const telemetryEnabled = customConfig?.telemetry !== false;

  function postTelemetryIfEnabled(payload: TelemetryPayload) {
    if (!telemetryEnabled) return;
    try {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "https://telemetry.ipriskify.com/v1", true);
      xhr.withCredentials = false;
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onerror = () => {};
      xhr.onload = () => {};
      xhr.send(JSON.stringify(payload));
    } catch (_) {
      // swallow background errors
    }
  }

  return {
    async get(): Promise<FingerprintResult> {
      const payload = await client.collectDataOnly();
      if (!payload) {
        const emptyUA = "";
        const b = parseBrowserFromUA(emptyUA);
        const o = parseOSFromUA(emptyUA);
        return {
          analysis: {
            fingerprint: "",
            browser: { ...b, ...o, user_agent: emptyUA },
            incognito: false,
            bot_detected: false,
          },
          fingerprint: {} as TelemetryPayload,
        };
      }
      const ua = payload.userAgent || "";
      const engine = payload.browserEngineSignature as
        | BrowserEngineId
        | undefined;
      const browser = parseBrowserFromUA(ua, engine);
      const os = parseOSFromUA(ua);
      const analysis: FingerprintAnalysis = {
        fingerprint: payload.fingerprint ?? "",
        browser: {
          name: browser.name,
          major_version: browser.major_version,
          full_version: browser.full_version,
          os: os.os,
          os_version: os.os_version,
          device: os.device,
          user_agent: ua,
        },
        incognito: payload.incognitoDetected === true,
        bot_detected: payload.automationInfo?.automationToolDetected === true,
      };
      // Background post full JSON payload to telemetry unless disabled
      postTelemetryIfEnabled(payload);
      return { analysis, fingerprint: payload };
    },
  };
}
