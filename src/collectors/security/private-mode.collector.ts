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
    try {
      const isPrivate = await this.detectIncognito();
      return { incognitoDetected: isPrivate };
    } catch {
      return { incognitoDetected: false };
    }
  }

  private async detectIncognito(): Promise<boolean> {
    const browserEngine = this.getBrowserEngine();

    if (browserEngine.isSafari) {
      return await this.testSafari();
    } else if (browserEngine.isChrome) {
      return await this.testChrome();
    } else if (browserEngine.isFirefox) {
      return await this.testFirefox();
    } else if (browserEngine.isMSIE) {
      return this.testMSIE();
    }

    return false;
  }

  private getBrowserEngine() {
    const engineId = this.getToFixedEngineId();
    return {
      isSafari: engineId === 44 || engineId === 43,
      isChrome: engineId === 51,
      isFirefox: engineId === 25,
      isMSIE: (navigator as any).msSaveBlob !== undefined,
    };
  }

  private getToFixedEngineId(): number {
    try {
      const neg = parseInt("-1");
      neg.toFixed(neg);
      return 0;
    } catch (e) {
      return (e as Error).message.length;
    }
  }

  private async testSafari(): Promise<boolean> {
    // Modern Safari: Use storage API
    if (typeof navigator.storage?.getDirectory === "function") {
      try {
        await navigator.storage.getDirectory();
        return false;
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return message.includes("unknown transient reason");
      }
    }

    // Safari 13-18: IndexedDB Blob test
    if (navigator.maxTouchPoints !== undefined) {
      return new Promise((resolve) => {
        const dbName = String(Math.random());
        try {
          const dbReq = indexedDB.open(dbName, 1);
          dbReq.onupgradeneeded = (ev) => {
            const db = (ev.target as IDBOpenDBRequest).result;
            try {
              db.createObjectStore("test", { autoIncrement: true }).put(
                new Blob(),
              );
              resolve(false);
            } catch (err) {
              const message = err instanceof Error ? err.message : String(err);
              resolve(message.includes("are not yet supported"));
            } finally {
              db.close();
              indexedDB.deleteDatabase(dbName);
            }
          };
          dbReq.onerror = () => resolve(false);
        } catch {
          resolve(false);
        }
      });
    }

    // Legacy Safari: localStorage test
    try {
      const openDB = (window as any).openDatabase;
      const storage = window.localStorage;
      openDB(null, null, null, null);
      storage.setItem("test", "1");
      storage.removeItem("test");
      return false;
    } catch {
      return true;
    }
  }

  private async testChrome(): Promise<boolean> {
    return new Promise((resolve) => {
      // Modern Chrome: Storage quota test
      const webkitStorage = (navigator as any).webkitTemporaryStorage;
      if (webkitStorage?.queryUsageAndQuota) {
        webkitStorage.queryUsageAndQuota(
          (_: number, quota: number) => {
            const quotaInMib = Math.round(quota / (1024 * 1024));
            const memoryLimit =
              (window as any)?.performance?.memory?.jsHeapSizeLimit ??
              1073741824;
            const quotaLimitInMib = Math.round(memoryLimit / (1024 * 1024)) * 2;
            resolve(quotaInMib < quotaLimitInMib);
          },
          () => resolve(false),
        );
        return;
      }

      // Legacy Chrome: FileSystem API test
      const fs = (window as any).webkitRequestFileSystem;
      if (fs) {
        fs(
          0,
          1,
          () => resolve(false),
          () => resolve(true),
        );
      } else {
        resolve(false);
      }
    });
  }

  private async testFirefox(): Promise<boolean> {
    // Modern Firefox: Storage API
    if (typeof navigator.storage?.getDirectory === "function") {
      try {
        await navigator.storage.getDirectory();
        return false;
      } catch (e) {
        const message = e instanceof Error ? e.message : String(e);
        return message.includes("Security error");
      }
    }

    // Legacy Firefox: ServiceWorker test
    return navigator.serviceWorker === undefined;
  }

  private testMSIE(): boolean {
    return window.indexedDB === undefined;
  }

  validate(data: Pick<TelemetryPayload, "incognitoDetected">): boolean {
    return typeof data.incognitoDetected === "boolean";
  }
}
