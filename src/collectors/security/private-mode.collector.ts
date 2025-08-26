import { BaseCollector, CollectorCategory, CollectorPriority } from "../base";
import { TelemetryPayload } from "../../types";

export class PrivateModeDetectionCollector extends BaseCollector<
  Pick<TelemetryPayload, "incognitoDetected">
> {
  constructor() {
    super({
  id: "private-mode-detection",
      category: CollectorCategory.SECURITY,
      priority: CollectorPriority.MEDIUM,
      timeout: 3000,
    });
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && typeof navigator !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "incognitoDetected">
  > {
    return new Promise((resolve) => {
      let resolved = false;
      const safetyTimeout = setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve({ incognitoDetected: false });
        }
      }, 1500);

      const resolveDetectionResult = (isPrivate: boolean) => {
        if (!resolved) {
          resolved = true;
          clearTimeout(safetyTimeout);
          resolve({ incognitoDetected: isPrivate });
        }
      };

      const assertEvalToString = (value: number): boolean =>
        value === eval.toString().length;

      const feid = (): number => {
        let neg: number = -1;
        try {
          neg.toFixed();
          return 25;
        } catch (e: unknown) {
          if (e instanceof Error) {
            return e.message.length;
          }
          return 15;
        }
      };

      const isMSIE = (): boolean =>
        (navigator as any).msSaveBlob !== undefined && assertEvalToString(39);

      const isChrome = (): boolean => {
        const win = window as any;
        return win.chrome !== undefined && win.chrome.runtime !== undefined;
      };

      const isSafari = (): boolean => {
        const win = window as any;
        return (
          /Safari/.test(navigator.userAgent) &&
          /Apple Computer/.test(navigator.vendor) &&
          win.openDatabase !== undefined
        );
      };

      const isFirefox = (): boolean =>
        feid() === 25 || typeof (window as any).InstallTrigger !== "undefined";

      if (isMSIE()) {
        this.msiePrivateTest(resolveDetectionResult);
      } else if (isChrome()) {
        this.chromePrivateTest(resolveDetectionResult);
      } else if (isSafari()) {
        this.safariPrivateTest(resolveDetectionResult);
      } else if (isFirefox()) {
        this.firefoxPrivateTest(resolveDetectionResult);
      } else {
        resolveDetectionResult(false);
      }
    });
  }

  private msiePrivateTest(callback: (isPrivate: boolean) => void): void {
    callback(false);
  }

  private chromePrivateTest(callback: (isPrivate: boolean) => void): void {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      navigator.storage
        .estimate()
        .then((estimate) => {
          callback(estimate.quota! < 120000000);
        })
        .catch(() => callback(false));
    } else {
      callback(false);
    }
  }

  private safariPrivateTest(callback: (isPrivate: boolean) => void): void {
    try {
      const storage = (window as any).localStorage;
      storage.setItem("x", "x");
      storage.removeItem("x");
      callback(false);
    } catch (e) {
      callback(true);
    }
  }

  private firefoxPrivateTest(callback: (isPrivate: boolean) => void): void {
    try {
      const db = indexedDB.open("x");
      db.onerror = () => callback(true);
      db.onsuccess = () => callback(false);
    } catch (e) {
      callback(true);
    }
  }

  validate(data: Pick<TelemetryPayload, "incognitoDetected">): boolean {
    return typeof data.incognitoDetected === "boolean";
  }
}
