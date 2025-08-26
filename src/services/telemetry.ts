import { TelemetryPayload } from "../types";

export class TelemetryService {
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  async collectFingerprint(): Promise<TelemetryPayload> {
    const payload: TelemetryPayload = {};
    return payload;
  }

  async generateFullFingerprint(): Promise<TelemetryPayload> {
    const payload = await this.collectFingerprint();
    return payload;
  }
}
