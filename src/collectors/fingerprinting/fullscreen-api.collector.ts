import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload } from "../../types";
import { getFullscreenPropertiesFingerprint } from "../../utils/browser";

export class FullscreenApiFingerprintCollector extends BaseCollector<
  Pick<TelemetryPayload, "fullscreenApiFingerprint">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.FULLSCREEN_API_FINGERPRINT,
      category: CollectorCategory.FINGERPRINTING,
      priority: CollectorPriority.LOW,
    });
  }

  isSupported(): boolean {
    return typeof document !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "fullscreenApiFingerprint">
  > {
    const fullscreenApiFingerprint = this.safeExecute(
      () => getFullscreenPropertiesFingerprint(),
      0,
    );
    return { fullscreenApiFingerprint };
  }

  validate(data: Pick<TelemetryPayload, "fullscreenApiFingerprint">): boolean {
    return (
      this.validateDataStructure(data, ["fullscreenApiFingerprint"]) &&
      typeof data.fullscreenApiFingerprint === "number"
    );
  }
}
