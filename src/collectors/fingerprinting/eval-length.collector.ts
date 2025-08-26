import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload } from "../../types";
import { getEvalToStringLengthFingerprint } from "../../utils/browser";

export class EvalLengthFingerprintCollector extends BaseCollector<
  Pick<TelemetryPayload, "evalLengthFingerprint">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.EVAL_LENGTH_FINGERPRINT,
      category: CollectorCategory.FINGERPRINTING,
      priority: CollectorPriority.LOW,
    });
  }

  isSupported(): boolean {
    return typeof window !== "undefined";
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "evalLengthFingerprint">
  > {
    const evalLengthFingerprint = this.safeExecute(
      () => getEvalToStringLengthFingerprint(),
      0,
    );
    return { evalLengthFingerprint };
  }

  validate(data: Pick<TelemetryPayload, "evalLengthFingerprint">): boolean {
    return (
      this.validateDataStructure(data, ["evalLengthFingerprint"]) &&
      typeof data.evalLengthFingerprint === "number"
    );
  }
}
