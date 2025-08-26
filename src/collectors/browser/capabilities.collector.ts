import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import {
  TelemetryPayload,
  BrowserCapabilityInfo,
  WindowExtended,
  NavigatorExtended,
} from "../../types";

export class BrowserCapabilitiesCollector extends BaseCollector<
  Pick<TelemetryPayload, "browserCapabilityInfo">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.BROWSER_CAPABILITIES,
      category: CollectorCategory.BROWSER,
      priority: CollectorPriority.HIGH,
    });
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && typeof navigator !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "browserCapabilityInfo">
  > {
    const caps: BrowserCapabilityInfo = {};
    const win = window as WindowExtended;

    caps.hasSessionStorage = this.safeExecute(
      () => (typeof win.sessionStorage !== "undefined" ? 1 : 0),
      0,
    );
    caps.hasLocalStorage = this.safeExecute(
      () => (typeof win.localStorage !== "undefined" ? 1 : 0),
      0,
    );
    caps.hasIndexedDB = this.safeExecute(
      () => (typeof win.indexedDB !== "undefined" ? 1 : 0),
      0,
    );
    caps.cookiesEnabled = navigator.cookieEnabled;
    caps.javaEnabled = this.safeExecute(() => navigator.javaEnabled(), false);
    caps.hasWebkitRequestFileSystem = this.safeExecute(
      () => typeof win.webkitRequestFileSystem === "function",
      false,
    );
    caps.hasOpenDatabase = this.safeExecute(
      () => typeof win.openDatabase === "function",
      false,
    );
    caps.hasPromiseAllSettled = this.safeExecute(
      () =>
        typeof Promise !== "undefined" &&
        typeof (Promise as any).allSettled === "function",
      false,
    );
    caps.hasMsSaveBlob = this.safeExecute(
      () => typeof (navigator as NavigatorExtended).msSaveBlob === "function",
      false,
    );

    return { browserCapabilityInfo: caps };
  }

  validate(data: Pick<TelemetryPayload, "browserCapabilityInfo">): boolean {
    return (
      this.validateDataStructure(data, ["browserCapabilityInfo"]) &&
      Boolean(
        data.browserCapabilityInfo &&
          typeof data.browserCapabilityInfo.cookiesEnabled === "boolean",
      )
    );
  }
}
