type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: Record<string, unknown>;
}

const formatLog = (entry: LogEntry): string => {
  const base = `[${entry.timestamp}] ${entry.level.toUpperCase()}: ${entry.message}`;
  return entry.context ? `${base} ${JSON.stringify(entry.context)}` : base;
};

export const logger = {
  debug(message: string, context?: Record<string, unknown>) {
    console.debug(formatLog({ timestamp: new Date().toISOString(), level: "debug", message, context }));
  },
  info(message: string, context?: Record<string, unknown>) {
    console.log(formatLog({ timestamp: new Date().toISOString(), level: "info", message, context }));
  },
  warn(message: string, context?: Record<string, unknown>) {
    console.warn(formatLog({ timestamp: new Date().toISOString(), level: "warn", message, context }));
  },
  error(message: string, context?: Record<string, unknown>) {
    console.error(formatLog({ timestamp: new Date().toISOString(), level: "error", message, context }));
  },
};