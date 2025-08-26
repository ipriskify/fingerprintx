import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import {
  TelemetryPayload,
  DimensionsMessage,
  OptionalDimensionsMessage,
} from "../../types";

export class BrowserFeaturesCollector extends BaseCollector<
  Pick<
    TelemetryPayload,
    | "adBlockerDetected"
    | "screenResMismatch"
    | "windowInnerDimensionsObj"
    | "bodyClientDimensionsObj"
    | "browserOnline"
    | "isIframed"
    | "documentHidden"
  >
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.BROWSER_FEATURES,
      category: CollectorCategory.BROWSER,
      priority: CollectorPriority.MEDIUM,
    });
  }

  isSupported(): boolean {
    return (
      typeof window !== "undefined" &&
      typeof document !== "undefined" &&
      typeof navigator !== "undefined"
    );
  }

  protected async doCollect(): Promise<
    Pick<
      TelemetryPayload,
      | "adBlockerDetected"
      | "screenResMismatch"
      | "windowInnerDimensionsObj"
      | "bodyClientDimensionsObj"
      | "browserOnline"
      | "isIframed"
      | "documentHidden"
    >
  > {
    const adBlockerDetected = await this.detectAdBlocker();
    const screenResMismatch = this.safeExecute(
      () => this.detectScreenMismatch(),
      undefined,
    );
    const windowDimensions = this.safeExecute(
      () => this.getWindowDimensions(),
      {
        windowInner: undefined,
        bodyClient: undefined,
      },
    );
    const documentState = this.safeExecute(() => this.getDocumentState(), {
      browserOnline: false,
      isIframed: true,
      documentHidden: false,
    });

    return {
      adBlockerDetected,
      screenResMismatch,
      windowInnerDimensionsObj: windowDimensions.windowInner,
      bodyClientDimensionsObj: windowDimensions.bodyClient,
      ...documentState,
    };
  }

  private async detectAdBlocker(): Promise<boolean> {
    return new Promise((resolve) => {
      try {
        const adsEl = document.createElement("div");
        adsEl.className = "adsbox ad-zone";
        adsEl.style.position = "absolute";
        adsEl.style.height = "10px";
        adsEl.style.width = "10px";
        adsEl.style.opacity = "0.01";
        adsEl.style.left = "-9999px";
        document.body.appendChild(adsEl);

        setTimeout(() => {
          const detected =
            adsEl.offsetHeight === 0 ||
            adsEl.offsetParent === null ||
            getComputedStyle(adsEl).display === "none";
          document.body.removeChild(adsEl);
          resolve(detected);
        }, 60);
      } catch (e) {
        resolve(false);
      }
    });
  }

  private detectScreenMismatch(): boolean | undefined {
    try {
      return (
        screen.width < screen.availWidth || screen.height < screen.availHeight
      );
    } catch (e) {
      return undefined;
    }
  }

  private getWindowDimensions() {
    const windowInner: OptionalDimensionsMessage = {};
    const bodyClient: OptionalDimensionsMessage = {};

    try {
      windowInner.width = window.innerWidth;
      windowInner.height = window.innerHeight;
    } catch (e) {}

    try {
      const body = document.body;
      const docEl = document.documentElement;
      const w =
        window.innerWidth ||
        (docEl && docEl.clientWidth) ||
        (body && body.clientWidth);
      const h =
        window.innerHeight ||
        (docEl && docEl.clientHeight) ||
        (body && body.clientHeight);
      bodyClient.width = w;
      bodyClient.height = h;
    } catch (e) {}

    // Convert to DimensionsMessage if both width and height are available
    const windowInnerDims: DimensionsMessage | undefined =
      windowInner.width !== undefined && windowInner.height !== undefined
        ? { width: windowInner.width, height: windowInner.height }
        : undefined;

    const bodyClientDims: DimensionsMessage | undefined =
      bodyClient.width !== undefined && bodyClient.height !== undefined
        ? { width: bodyClient.width, height: bodyClient.height }
        : undefined;

    return {
      windowInner: windowInnerDims,
      bodyClient: bodyClientDims,
    };
  }

  private getDocumentState() {
    return {
      browserOnline: navigator.onLine,
      isIframed: this.safeExecute(() => window.top !== window.self, true),
      documentHidden: document.hidden,
    };
  }

  validate(
    data: Pick<
      TelemetryPayload,
      | "adBlockerDetected"
      | "screenResMismatch"
      | "windowInnerDimensionsObj"
      | "bodyClientDimensionsObj"
      | "browserOnline"
      | "isIframed"
      | "documentHidden"
    >,
  ): boolean {
    return (
      this.validateDataStructure(data, [
        "adBlockerDetected",
        "browserOnline",
        "isIframed",
        "documentHidden",
      ]) &&
      typeof data.adBlockerDetected === "boolean" &&
      typeof data.browserOnline === "boolean" &&
      typeof data.isIframed === "boolean" &&
      typeof data.documentHidden === "boolean"
    );
  }
}
