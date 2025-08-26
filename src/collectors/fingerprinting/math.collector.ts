import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload } from "../../types";
import { getJsMathEngineFingerprint } from "../../utils/browser";

export class MathFingerprintCollector extends BaseCollector<
  Pick<TelemetryPayload, "mathFingerprint">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.MATH_FINGERPRINT,
      category: CollectorCategory.FINGERPRINTING,
      priority: CollectorPriority.MEDIUM,
    });
  }

  isSupported(): boolean {
    return typeof window !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "mathFingerprint">
  > {
    const mathFingerprint = this.safeExecute(
      () => getJsMathEngineFingerprint(),
      0,
    );
    return { mathFingerprint };
  }

  validate(data: Pick<TelemetryPayload, "mathFingerprint">): boolean {
    return (
      this.validateDataStructure(data, ["mathFingerprint"]) &&
      typeof data.mathFingerprint === "number"
    );
  }
}
