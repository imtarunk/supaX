interface LogMessage {
  message: string;
  data?: unknown;
  timestamp: string;
}

const formatTimestamp = (date: Date): string => {
  return date.toISOString().replace("T", " ").split(".")[0];
};

export const logInfo = (message: string, data?: unknown): void => {
  const logMessage: LogMessage = {
    message,
    data,
    timestamp: formatTimestamp(new Date()),
  };
  console.log(JSON.stringify(logMessage, null, 2));
};

export const logError = (message: string, error?: unknown): void => {
  const logMessage: LogMessage = {
    message,
    data: error instanceof Error ? error.message : error,
    timestamp: formatTimestamp(new Date()),
  };
  console.error(JSON.stringify(logMessage, null, 2));
};

export const logDebug = (message: string, data?: unknown): void => {
  if (process.env.NODE_ENV === "development") {
    const logMessage: LogMessage = {
      message,
      data,
      timestamp: formatTimestamp(new Date()),
    };
    console.debug(JSON.stringify(logMessage, null, 2));
  }
};
