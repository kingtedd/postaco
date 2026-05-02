import fs from 'fs';
import path from 'path';

const logsDir = './logs';

// Create logs directory if it doesn't exist
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG'
}

class Logger {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(level: LogLevel, message: string, data?: any): string {
    const dataStr = data ? `\n${JSON.stringify(data, null, 2)}` : '';
    return `[${this.getTimestamp()}] [${level}] ${message}${dataStr}`;
  }

  private log(level: LogLevel, message: string, data?: any) {
    const formatted = this.formatMessage(level, message, data);
    console.log(formatted);

    // Write to file
    const logFile = path.join(logsDir, `${level.toLowerCase()}.log`);
    fs.appendFileSync(logFile, formatted + '\n');
  }

  error(message: string, error?: any) {
    this.log(LogLevel.ERROR, message, error);
  }

  warn(message: string, data?: any) {
    this.log(LogLevel.WARN, message, data);
  }

  info(message: string, data?: any) {
    this.log(LogLevel.INFO, message, data);
  }

  debug(message: string, data?: any) {
    if (process.env.LOG_LEVEL === 'debug') {
      this.log(LogLevel.DEBUG, message, data);
    }
  }
}

export const logger = new Logger();
