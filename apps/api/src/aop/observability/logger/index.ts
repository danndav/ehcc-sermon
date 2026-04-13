import { ConsoleLogger } from '@nestjs/common';

export interface CustomLogger {
  debug: (message: string, data?: Record<string, unknown>) => void;
  info: (message: string, data?: Record<string, unknown>) => void;
  warn: (message: string, data?: Record<string, unknown>) => void;
  error: (message: string, data?: Record<string, unknown>) => void;
}

export class Logger implements CustomLogger {
  private readonly nestJsLogger: ConsoleLogger;

  constructor(
    private readonly isAdmin?: boolean,
    private readonly traceId?: string,
    private readonly contextData?: Record<string, unknown>
  ) {
    this.nestJsLogger = new ConsoleLogger();

    this.traceId = traceId || '#no-trace-id';
  }

  debug(_message: string, attributes?: Record<string, unknown>): void {
    const message = `[TRACE_ID]: ${this.traceId} ${this.getLogMessage(_message)} ${this.getContextData()} ${
      attributes ? JSON.stringify(attributes) : ''
    }`;

    this.nestJsLogger.debug(message);
  }

  info(_message: string, attributes?: Record<string, unknown>): void {
    const message = `[TRACE_ID]: ${this.traceId} ${this.getLogMessage(_message)} ${this.getContextData()} ${
      attributes ? JSON.stringify(attributes) : ''
    }`;

    this.nestJsLogger.log(message);
  }

  warn(_message: string, attributes?: Record<string, unknown>): void {
    const message = `[TRACE_ID]: ${this.traceId} ${this.getLogMessage(_message)} ${this.getContextData()} ${
      attributes ? JSON.stringify(attributes) : ''
    }`;

    this.nestJsLogger.warn(message);
  }

  error(_message: string, attributes?: Record<string, unknown>): void {
    const message = `[TRACE_ID]: ${this.traceId} ${this.getLogMessage(_message)} ${this.getContextData()} ${
      attributes ? JSON.stringify(attributes) : ''
    }`;

    this.nestJsLogger.error(message);
  }

  private getLogMessage(message: string): string {
    return this.isAdmin ? `[ADMIN] ${message}` : message;
  }

  private getContextData(): string {
    return this.contextData ? JSON.stringify(this.contextData) : '';
  }
}

const logger = new Logger(true);

export default logger;
