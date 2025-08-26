import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import {
  TelemetryPayload,
  NavigatorExtended,
  WindowExtended,
} from "../../types";
import { BrowserEngineId } from "../../types/enums";

export class BrowserIdentityCollector extends BaseCollector<
  Pick<TelemetryPayload, "jsErrorSignature" | "browserEngineSignature">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.BROWSER_IDENTITY,
      category: CollectorCategory.BROWSER,
      priority: CollectorPriority.MEDIUM,
    });
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && typeof navigator !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "jsErrorSignature" | "browserEngineSignature">
  > {
    return new Promise((resolve) => {
      const data: Pick<
        TelemetryPayload,
        "jsErrorSignature" | "browserEngineSignature"
      > = {
        jsErrorSignature: "c",
        browserEngineSignature: BrowserEngineId.UNKNOWN_BROWSER,
      };

      const winExt = window as WindowExtended;
      const navExt = navigator as NavigatorExtended;

      const finalizeResolution = (signature: BrowserEngineId) => {
        data.browserEngineSignature = signature;
        resolve(data);
      };

      if (navExt.brave && typeof navExt.brave.isBrave === "function") {
        navExt.brave
          .isBrave()
          .then((isBrave: boolean) => {
            finalizeResolution(
              isBrave ? BrowserEngineId.BRAVE : BrowserEngineId.CHROME,
            );
          })
          .catch(() => {
            this.checkOtherBrowsers(finalizeResolution);
          });
      } else {
        this.checkOtherBrowsers(finalizeResolution);
      }
    });
  }

  private checkOtherBrowsers(
    callback: (signature: BrowserEngineId) => void,
  ): void {
    const winExt = window as WindowExtended;

    if (winExt.chrome && winExt.chrome.webstore) {
      callback(BrowserEngineId.CHROME);
    } else if (typeof winExt.InstallTrigger !== "undefined") {
      callback(BrowserEngineId.FIREFOX);
    } else if (winExt.StyleMedia) {
      callback(BrowserEngineId.EDGE);
    } else if (winExt.opera) {
      callback(BrowserEngineId.OPERA);
    } else if (
      Object.prototype.toString
        .call(window.HTMLElement)
        .indexOf("Constructor") > 0 ||
      (function (p) {
        return p.toString() === "[object SafariRemoteNotification]";
      })(
        !(window as any)["safari"] ||
          (typeof (window as any).safari !== "undefined" &&
            (window as any).safari.pushNotification),
      )
    ) {
      callback(BrowserEngineId.SAFARI);
    } else {
      callback(BrowserEngineId.UNKNOWN_BROWSER);
    }
  }

  validate(
    data: Pick<TelemetryPayload, "jsErrorSignature" | "browserEngineSignature">,
  ): boolean {
    return Boolean(
      data.jsErrorSignature && data.browserEngineSignature !== undefined,
    );
  }
}
