export class ErrorReporter {
    constructor(
      private readonly isAdmin?: boolean,
      private readonly traceId?: string
    ) {
      if (!traceId) {
        this.traceId = '#no-trace-id';
      }
    }
  
    report(): void {
    }
  }
  