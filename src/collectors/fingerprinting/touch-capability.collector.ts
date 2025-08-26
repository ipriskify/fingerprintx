import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload, TouchCapabilityDetailsMessage } from "../../types";

export class TouchCapabilityCollector extends BaseCollector<
  Pick<TelemetryPayload, "touchCapabilityDetails" | "maxTouchPoints">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.TOUCH_CAPABILITY,
      category: CollectorCategory.FINGERPRINTING,
      priority: CollectorPriority.MEDIUM,
    });
  }

  isSupported(): boolean {
    return typeof window !== "undefined" && typeof navigator !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "touchCapabilityDetails" | "maxTouchPoints">
  > {
    const touchData = this.safeExecute(
      () => {
        const touchEventSupported = "ontouchstart" in window;
        const touchApiSupported = typeof Touch !== "undefined";
        const maxPoints = navigator.maxTouchPoints || 0;

        const touchCapabilityDetails: TouchCapabilityDetailsMessage = {
          maxTouchPoints: maxPoints,
          touchEvent: touchEventSupported,
          touchStart: touchEventSupported,
          maxPoints,
          touchEventSupported,
          touchApiSupported,
        };

        return {
          touchCapabilityDetails,
          maxTouchPoints: maxPoints,
        };
      },
      {
        touchCapabilityDetails: {
          maxTouchPoints: 0,
          touchEvent: false,
          touchStart: false,
          maxPoints: 0,
          touchEventSupported: false,
          touchApiSupported: false,
        },
        maxTouchPoints: 0,
      },
    );

    return touchData;
  }

  validate(
    data: Pick<TelemetryPayload, "touchCapabilityDetails" | "maxTouchPoints">,
  ): boolean {
    return (
      this.validateDataStructure(data, [
        "touchCapabilityDetails",
        "maxTouchPoints",
      ]) &&
      Boolean(data.touchCapabilityDetails) &&
      typeof data.maxTouchPoints === "number"
    );
  }
}
