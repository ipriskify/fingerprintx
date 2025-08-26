import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload } from "../../types";
import { getClientRectsFingerprint } from "../../utils/browser";

export class ClientRectsFingerprintCollector extends BaseCollector<
  Pick<TelemetryPayload, "rectsFingerprint">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.CLIENT_RECTS_FINGERPRINT,
      category: CollectorCategory.FINGERPRINTING,
      priority: CollectorPriority.MEDIUM,
    });
  }

  isSupported(): boolean {
    return typeof document !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "rectsFingerprint">
  > {
    const rectsFingerprint = this.safeExecute(
      () => getClientRectsFingerprint(),
      0,
    );
    return { rectsFingerprint };
  }

  validate(data: Pick<TelemetryPayload, "rectsFingerprint">): boolean {
    return (
      this.validateDataStructure(data, ["rectsFingerprint"]) &&
      typeof data.rectsFingerprint === "number"
    );
  }
}
