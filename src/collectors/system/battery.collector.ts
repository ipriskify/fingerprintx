import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import {
  TelemetryPayload,
  NavigatorExtended,
  BatteryManager,
} from "../../types";

export class BatteryCollector extends BaseCollector<
  Pick<TelemetryPayload, "batteryStatusIssue">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.SYSTEM_BATTERY,
      category: CollectorCategory.SYSTEM,
      priority: CollectorPriority.LOW,
    });
  }

  isSupported(): boolean {
    return typeof navigator !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "batteryStatusIssue">
  > {
    return new Promise((resolve) => {
      const navExt = navigator as NavigatorExtended;

      if (navExt.getBattery) {
        navExt
          .getBattery()
          .then((bat: BatteryManager) => {
            resolve({ batteryStatusIssue: false });
          })
          .catch(() => {
            resolve({ batteryStatusIssue: true });
          });
      } else {
        resolve({ batteryStatusIssue: true });
      }
    });
  }

  validate(data: Pick<TelemetryPayload, "batteryStatusIssue">): boolean {
    return typeof data.batteryStatusIssue === "boolean";
  }
}
