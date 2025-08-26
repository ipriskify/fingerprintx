import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload, ScreenInfo, DimensionsMessage } from "../../types";

export class ScreenCollector extends BaseCollector<
  Pick<TelemetryPayload, "screenInfo">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.SCREEN_INFO,
      category: CollectorCategory.DEVICE,
      priority: CollectorPriority.HIGH,
      timeout: 2000,
    });
  }

  isSupported(): boolean {
    return typeof screen !== "undefined" && typeof document !== "undefined";
  }

  protected async doCollect(): Promise<Pick<TelemetryPayload, "screenInfo">> {
    const screenInfo: ScreenInfo = {
      dimensionsObj: undefined,
      availDimensionsObj: undefined,
    };

    screenInfo.colorDepth = this.safeExecute(() => screen.colorDepth || -1, -1);

    screenInfo.devicePixelRatio = this.safeExecute(
      () => window.devicePixelRatio,
      undefined,
    );

    screenInfo.dimensionsObj = this.safeExecute(
      () => ({
        width: screen.width,
        height: screen.height,
      }),
      { width: 0, height: 0 },
    );

    screenInfo.availDimensionsObj = this.safeExecute(
      () => ({
        width: screen.availWidth,
        height: screen.availHeight,
      }),
      { width: 0, height: 0 },
    );

    screenInfo.screenDpi = this.safeExecute(() => {
      const testInchDiv = document.createElement("div");
      testInchDiv.style.width = "1in";
      document.body.appendChild(testInchDiv);
      const dpi = testInchDiv.offsetWidth || 96;
      document.body.removeChild(testInchDiv);
      return dpi;
    }, 96);

    return { screenInfo };
  }

  validate(data: Pick<TelemetryPayload, "screenInfo">): boolean {
    return Boolean(data.screenInfo && data.screenInfo.colorDepth !== undefined);
  }
}
