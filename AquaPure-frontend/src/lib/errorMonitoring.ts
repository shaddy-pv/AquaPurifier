// Error monitoring and logging

export interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: string;
  url: string;
  userAgent: string;
  userId?: string;
  additionalInfo?: any;
}

class ErrorMonitor {
  private errors: ErrorLog[] = [];
  private maxErrors = 100;

  constructor() {
    this.setupGlobalErrorHandlers();
  }

  private setupGlobalErrorHandlers() {
    // Catch unhandled errors
    window.addEventListener("error", (event) => {
      this.logError({
        message: event.message,
        stack: event.error?.stack,
        url: event.filename || window.location.href,
        line: event.lineno,
        column: event.colno,
      });
    });

    // Catch unhandled promise rejections
    window.addEventListener("unhandledrejection", (event) => {
      this.logError({
        message: `Unhandled Promise Rejection: ${event.reason}`,
        stack: event.reason?.stack,
        url: window.location.href,
      });
    });
  }

  logError(error: {
    message: string;
    stack?: string;
    url?: string;
    line?: number;
    column?: number;
    additionalInfo?: any;
  }) {
    const errorLog: ErrorLog = {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString(),
      url: error.url || window.location.href,
      userAgent: navigator.userAgent,
      additionalInfo: {
        line: error.line,
        column: error.column,
        ...error.additionalInfo,
      },
    };

    this.errors.push(errorLog);

    // Keep only last N errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("Error logged:", errorLog);
    }

    // In production, send to error tracking service
    this.sendToErrorService(errorLog);
  }

  private sendToErrorService(error: ErrorLog) {
    // In production, send to Sentry, LogRocket, or custom backend
    // For now, just store locally
    try {
      const storedErrors = localStorage.getItem("error_logs");
      const errors = storedErrors ? JSON.parse(storedErrors) : [];
      errors.push(error);
      
      // Keep only last 50 errors in localStorage
      if (errors.length > 50) {
        errors.shift();
      }
      
      localStorage.setItem("error_logs", JSON.stringify(errors));
    } catch (e) {
      console.error("Failed to store error log:", e);
    }
  }

  getErrors(): ErrorLog[] {
    return [...this.errors];
  }

  clearErrors() {
    this.errors = [];
    localStorage.removeItem("error_logs");
  }

  // Get error statistics
  getErrorStats() {
    const errors = this.getErrors();
    const errorsByType: Record<string, number> = {};
    
    errors.forEach((error) => {
      const type = error.message.split(":")[0] || "Unknown";
      errorsByType[type] = (errorsByType[type] || 0) + 1;
    });

    return {
      totalErrors: errors.length,
      errorsByType,
      recentErrors: errors.slice(-10),
    };
  }
}

// Export singleton instance
export const errorMonitor = new ErrorMonitor();

// Helper functions
export const logError = (message: string, additionalInfo?: any) => {
  errorMonitor.logError({
    message,
    additionalInfo,
  });
};

export const logApiError = (endpoint: string, status: number, message: string) => {
  errorMonitor.logError({
    message: `API Error: ${endpoint}`,
    additionalInfo: {
      endpoint,
      status,
      message,
    },
  });
};

export const logComponentError = (componentName: string, error: Error) => {
  errorMonitor.logError({
    message: `Component Error in ${componentName}: ${error.message}`,
    stack: error.stack,
    additionalInfo: {
      componentName,
    },
  });
};
