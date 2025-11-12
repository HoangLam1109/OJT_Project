# Centralized Logging Integration

This document explains how the IAM service integrates with the centralized `monitoringService` while maintaining microservice independence.

## Architecture Overview

The integration uses a **Ports and Adapters (Hexagonal Architecture)** pattern to keep IAM service decoupled from the monitoring infrastructure.

```
┌─────────────────────────────────────────┐
│         IAM Service (Core)              │
│  ┌────────────────────────────────┐    │
│  │  RoleService, EmailService     │    │
│  │  (Business Logic)               │    │
│  └──────────┬─────────────────────┘    │
│             │ uses                      │
│             ▼                           │
│  ┌────────────────────────────────┐    │
│  │    ILoggerPort (Interface)     │    │
│  │    - emitEvent()               │    │
│  │    - isHealthy()               │    │
│  └──────────┬─────────────────────┘    │
│             │ implemented by            │
│             ▼                           │
│  ┌─────────────────┬──────────────┐    │
│  │ NoOpAdapter     │ HttpAdapter  │    │
│  │ (local logs)    │ (monitoring) │    │
│  └─────────────────┴──────────────┘    │
└─────────────────────────────────────────┘
                    │
                    │ HTTP POST (optional)
                    ▼
        ┌───────────────────────┐
        │  MonitoringService    │
        │  POST /event-logs     │
        └───────────────────────┘
```

## Key Design Principles

### 1. **Independence**
- IAM service never imports or depends on monitoringService code
- Works fully offline if monitoring is unavailable
- No shared runtime dependencies

### 2. **Dual Logging**
- **Local audit logs**: Stored in IAM's own database for autonomy
- **Centralized logs**: Sent to monitoringService for cross-service visibility
- Both happen in parallel; failure in one doesn't affect the other

### 3. **Resilience**
The HTTP adapter includes multiple resilience patterns:

- **Fire-and-forget**: Logging never blocks business logic
- **Retries**: Exponential backoff with jitter (up to 3 attempts)
- **Circuit breaker**: Opens after 5 failures, prevents cascading issues
- **Timeout protection**: 5-second default timeout per request
- **Graceful degradation**: Falls back to NoOp if monitoring is unreachable

### 4. **Configuration-driven**
- Switch adapters via environment variables
- No code changes required to enable/disable monitoring
- Safe defaults (NoOp) prevent accidental coupling

## File Structure

```
src/
├── types/
│   └── monitoring.type.ts          # Shared event schema (no runtime coupling)
├── ports/
│   └── logger.port.ts              # ILoggerPort interface
├── adapters/
│   ├── logger.noop.adapter.ts      # Local-only logging
│   └── logger.http.adapter.ts      # HTTP client with resilience
├── config/
│   └── logger.config.ts            # Factory and singleton
└── services/
    ├── role.service.ts             # Updated to use logger port
    └── email.service.ts            # Updated to use logger port
```

## Configuration

### Environment Variables

```bash
# Logger Type: "http" | "noop"
LOGGER_TYPE=noop

# MonitoringService URL (required if LOGGER_TYPE=http)
MONITORING_SERVICE_URL=http://localhost:3005/api

# Optional: API key for authentication
MONITORING_API_KEY=your-api-key

# Optional: Request timeout in ms (default: 5000)
MONITORING_TIMEOUT=5000

# Optional: Max retry attempts (default: 3)
MONITORING_MAX_RETRIES=3
```

### Development Setup

1. **Local development (no monitoring)**:
   ```bash
   LOGGER_TYPE=noop
   ```
   Events are logged to console only.

2. **With monitoring service**:
   ```bash
   LOGGER_TYPE=http
   MONITORING_SERVICE_URL=http://localhost:3005/api
   ```
   Events are sent to monitoringService.

3. **Production**:
   ```bash
   LOGGER_TYPE=http
   MONITORING_SERVICE_URL=https://monitoring.yourcompany.com/api
   MONITORING_API_KEY=prod-api-key-here
   ```

## Usage in Services

### Before (tightly coupled)
```typescript
// Direct dependency on local audit log only
await auditLogRepository.create({
  eventCode: "E_00001",
  action: "CREATE",
  eventMessage: "Role created",
  userId: performedBy,
  performedAt: new Date(),
  serviceName: "Role Service",
});
```

### After (decoupled)
```typescript
import { getLogger } from "../config/logger.config.js";
import { MonitoringEvent } from "../types/monitoring.type.js";

// Keep local audit log for autonomy
await auditLogRepository.create({
  eventCode: "E_00001",
  action: "CREATE",
  eventMessage: "Role created",
  userId: performedBy,
  performedAt: new Date(),
  serviceName: "Role Service",
});

// Send to centralized monitoring (fire-and-forget)
const logger = getLogger();
const event: MonitoringEvent = {
  event_code: "E_00001",
  action: "CREATE",
  event_message: "Role created",
  service_name: "IAM_SERVICE",
  operator_id: performedBy,
  occurred_at: new Date(),
};

// Never blocks, never throws
logger.emitEvent(event).catch((error) => {
  console.error("Failed to emit monitoring event:", error);
});
```

## Event Schema

Events sent to monitoringService follow this schema:

```typescript
interface MonitoringEvent {
  event_code: string;           // e.g., "E_00001"
  action: string;               // e.g., "CREATE", "UPDATE", "DELETE"
  event_message: string;        // Human-readable description
  service_name: ServiceName;    // "IAM_SERVICE"
  operator_id: string;          // User who performed the action
  operator_name?: string;       // Optional: User's full name
  operator_gmail?: string;      // Optional: User's email
  operator_role?: string;       // Optional: User's role
  entity_id?: string;           // Optional: ID of affected entity
  old_values?: Record<string, unknown>;  // Optional: Before state
  new_values?: Record<string, unknown>;  // Optional: After state
  occurred_at?: Date;           // Optional: Event timestamp
  error_message?: string;       // Optional: Error details
}
```

## Resilience Features

### Circuit Breaker
```
States: CLOSED → OPEN → HALF_OPEN → CLOSED

CLOSED: Normal operation, requests go through
  ↓ (after 5 consecutive failures)
OPEN: All requests blocked for 60 seconds
  ↓ (after timeout)
HALF_OPEN: Next request is a test
  ↓ (on success)
CLOSED: Resume normal operation
```

### Retry Strategy
```
Attempt 1: Immediate
Attempt 2: Wait 1s + jitter
Attempt 3: Wait 2s + jitter
Attempt 4: Wait 4s + jitter (max 10s)
```

### Timeout Protection
- Default: 5 seconds per request
- Configurable via `MONITORING_TIMEOUT`
- Uses AbortController for clean cancellation

## Testing

### Unit Tests
```typescript
import { NoOpLoggerAdapter } from "./adapters/logger.noop.adapter";
import { HttpLoggerAdapter } from "./adapters/logger.http.adapter";

// Test NoOp adapter
const noopLogger = new NoOpLoggerAdapter();
await noopLogger.emitEvent(event); // Should not throw

// Test HTTP adapter with mock
const httpLogger = new HttpLoggerAdapter({
  baseUrl: "http://localhost:3005/api",
});
await httpLogger.emitEvent(event);
```

### Integration Tests
```bash
# Start monitoringService
cd services/monitoringService
npm start

# Start IAM service with HTTP logging
cd services/iam-service
LOGGER_TYPE=http MONITORING_SERVICE_URL=http://localhost:3005/api npm start

# Trigger an event (e.g., create a role)
# Check monitoringService logs/database for the event
```

## Monitoring Health

Check if the logger is healthy:
```typescript
const logger = getLogger();
if (logger.isHealthy()) {
  console.log("Logger is operational");
} else {
  console.warn("Logger circuit breaker is OPEN");
}
```

## Troubleshooting

### Events not appearing in monitoringService

1. **Check configuration**:
   ```bash
   echo $LOGGER_TYPE          # Should be "http"
   echo $MONITORING_SERVICE_URL  # Should be valid URL
   ```

2. **Check monitoringService health**:
   ```bash
   curl http://localhost:3005/api/health
   ```

3. **Check IAM service logs**:
   ```
   [LoggerFactory] Using HTTP logger - sending to http://...
   [HttpLoggerAdapter] Event emitted successfully: Event log created
   ```

4. **Check for circuit breaker**:
   ```
   [HttpLoggerAdapter] Circuit breaker is OPEN - skipping event emission
   ```
   Wait 60 seconds for automatic reset.

### High latency in IAM service

- Logging should never block business logic
- Check that you're using fire-and-forget pattern (no `await` on `emitEvent`)
- Verify timeout is reasonable (default 5s)

### Duplicate events

- This is expected: events are logged both locally and centrally
- Local logs: IAM's audit log database
- Central logs: monitoringService database
- Both provide different value (autonomy vs. visibility)

## Migration Checklist

- [x] Create shared types (`monitoring.type.ts`)
- [x] Define logger port interface (`logger.port.ts`)
- [x] Implement NoOp adapter (`logger.noop.adapter.ts`)
- [x] Implement HTTP adapter with resilience (`logger.http.adapter.ts`)
- [x] Create logger factory (`logger.config.ts`)
- [x] Update RoleService to use logger port
- [x] Update EmailService to use logger port
- [x] Add environment configuration (`.env.example`)
- [ ] Update other services (UserService, AuthService, etc.)
- [ ] Add correlation ID middleware for request tracing
- [ ] Set up monitoring dashboards in monitoringService
- [ ] Configure alerts for critical events
- [ ] Document event codes and actions

## Future Enhancements

1. **Correlation IDs**: Add request tracing across services
2. **Structured logging**: Enhance local logs with JSON format
3. **Batch sending**: Buffer events and send in batches
4. **Message broker**: Add Kafka/RabbitMQ adapter for async processing
5. **Metrics**: Expose Prometheus metrics for logging health
6. **PII redaction**: Automatically sanitize sensitive fields
7. **Event versioning**: Support schema evolution

## References

- [MonitoringService API](../monitoringService/README.md)
- [Event Codes](../monitoringService/src/constants/event.constant.ts)
- [Hexagonal Architecture](https://alistair.cockburn.us/hexagonal-architecture/)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html)
