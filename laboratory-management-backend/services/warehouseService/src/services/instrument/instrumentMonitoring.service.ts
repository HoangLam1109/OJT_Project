import monitoringServiceClient, { type MonitoringEventLogPayload } from "../monitoringService.client.js";
import {
  MonitoringEventCodes,
  MonitoringEventActions,
  MonitoringServiceName,
} from "../../constants/monitoring.constant.js";

interface InstrumentMonitoringPayload {
  instrumentId: string;
  instrumentCode: string;
  eventMessage: string;
  operatorId?: string | null;
  operatorEmail?: string | null;
  operatorName?: string | null;
  operatorRole?: string | null;
  oldValues?: Record<string, unknown> | null;
  newValues?: Record<string, unknown> | null;
}

class InstrumentMonitoringService {
  private normalize(value: string | null | undefined): string | undefined {
    if (typeof value === "string" && value.trim().length > 0) {
      return value.trim();
    }
    return undefined;
  }

  async recordCreated(payload: InstrumentMonitoringPayload): Promise<void> {
    await this.sendEvent({
      ...payload,
      eventCode: MonitoringEventCodes.INSTRUMENT_CREATED,
      action: MonitoringEventActions.CREATE,
    });
  }

  async recordUpdated(payload: InstrumentMonitoringPayload): Promise<void> {
    await this.sendEvent({
      ...payload,
      eventCode: MonitoringEventCodes.INSTRUMENT_UPDATED,
      action: MonitoringEventActions.UPDATE,
    });
  }

  async recordDeleted(payload: InstrumentMonitoringPayload): Promise<void> {
    await this.sendEvent({
      ...payload,
      eventCode: MonitoringEventCodes.INSTRUMENT_DELETED,
      action: MonitoringEventActions.DELETE,
    });
  }

  private async sendEvent(
    payload: InstrumentMonitoringPayload & { eventCode: string; action: string }
  ): Promise<void> {
    const operatorId = this.normalize(payload.operatorId) ?? "system";
    const operatorEmail = this.normalize(payload.operatorEmail);
    const operatorName = this.normalize(payload.operatorName);
    const operatorRole = this.normalize(payload.operatorRole);

    const monitoringPayload: MonitoringEventLogPayload = {
      event_code: payload.eventCode,
      action: payload.action,
      event_message: payload.eventMessage,
      service_name: MonitoringServiceName,
      entity_id: payload.instrumentId,
      old_values: payload.oldValues ?? null,
      new_values: payload.newValues ?? null,
      operator_id: operatorId,
      occurred_at: new Date(),
    };

    if (operatorName) {
      monitoringPayload.operator_name = operatorName;
    }

    if (operatorEmail && operatorEmail.includes("@")) {
      monitoringPayload.operator_gmail = operatorEmail;
    }

    if (operatorRole) {
      monitoringPayload.operator_role = operatorRole;
    }

    try {
      await monitoringServiceClient.createEventLog(monitoringPayload);
    } catch (error) {
      const message = error instanceof Error ? error.message : JSON.stringify(error);
      console.error(
        `[InstrumentMonitoringService] Failed to record instrument event ${payload.eventCode}: ${message}`
      );
    }
  }
}

const instrumentMonitoringService = new InstrumentMonitoringService();
export default instrumentMonitoringService;
export type { InstrumentMonitoringPayload };
