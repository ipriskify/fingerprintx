import {
  BaseCollector,
  CollectorCategory,
  CollectorPriority,
  COLLECTOR_IDS,
} from "../base";
import { TelemetryPayload } from "../../types";

export class PerformanceCollector extends BaseCollector<
  Pick<TelemetryPayload, "canvasImageDataBenchmark">
> {
  constructor() {
    super({
      id: COLLECTOR_IDS.CANVAS_PERFORMANCE,
      category: CollectorCategory.SYSTEM,
      priority: CollectorPriority.OPTIONAL,
    });
  }

  isSupported(): boolean {
    return (
      typeof document !== "undefined" &&
      typeof performance !== "undefined" &&
      typeof performance.now === "function"
    );
  }

  protected async doCollect(): Promise<
    Pick<TelemetryPayload, "canvasImageDataBenchmark">
  > {
    return {
      canvasImageDataBenchmark: this.safeExecute(
        () => this.measureCanvasPerformance(),
        -1,
      ),
    };
  }

  private measureCanvasPerformance(): number {
    const iterations = 100;
    const canvas = document.createElement("canvas");
    canvas.width = 200;
    canvas.height = 200;
    const ctx = canvas.getContext("2d");

    if (!ctx) return -1;

    const start = performance.now();

    for (let i = 0; i < iterations; i++) {
      ctx.clearRect(0, 0, 200, 200);
      ctx.fillStyle = `hsl(${i * 3.6}, 50%, 50%)`;
      ctx.fillRect(i % 200, (i * 2) % 200, 10, 10);
      ctx.strokeStyle = "#000";
      ctx.strokeRect(0, 0, 200, 200);
      ctx.getImageData(0, 0, 200, 200);
    }

    const end = performance.now();
    return Math.round((end - start) * 100) / 100;
  }

  validate(data: Pick<TelemetryPayload, "canvasImageDataBenchmark">): boolean {
    return typeof data.canvasImageDataBenchmark === "number";
  }
}
