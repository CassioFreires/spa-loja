/**
 * Utilidades de log para facilitar debugging
 * Padrão consistente para todos os logs da aplicação
 */

type LogLevel = 'info' | 'success' | 'error' | 'warn';

interface LogData {
  [key: string]: unknown;
}

const getTimestamp = (): string => {
  return new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const getLogStyle = (level: LogLevel): string => {
  const styles: Record<LogLevel, string> = {
    info: 'color: #3B82F6; font-weight: bold;',
    success: 'color: #10B981; font-weight: bold;',
    error: 'color: #EF4444; font-weight: bold;',
    warn: 'color: #F59E0B; font-weight: bold;',
  };
  return styles[level];
};

const formatLog = (data?: LogData): void => {
  if (data && Object.keys(data).length > 0) {
    console.log(`📋 ${JSON.stringify(data, null, 2)}`);
  }
};

/**
 * Log de sucesso
 */
export const logSuccess = (message: string, data?: LogData): void => {
  const timestamp = getTimestamp();
  console.log(`%c[${timestamp}] ✅ ${message}`, getLogStyle('success'));
  formatLog(data);
};

/**
 * Log de erro
 */
export const logError = (message: string, data?: LogData): void => {
  const timestamp = getTimestamp();
  console.error(`%c[${timestamp}] ❌ ${message}`, getLogStyle('error'));
  formatLog(data);
};

/**
 * Log de informação
 */
export const logInfo = (message: string, data?: LogData): void => {
  const timestamp = getTimestamp();
  console.log(`%c[${timestamp}] ℹ️ ${message}`, getLogStyle('info'));
  formatLog(data);
};

/**
 * Log de aviso
 */
export const logWarn = (message: string, data?: LogData): void => {
  const timestamp = getTimestamp();
  console.warn(`%c[${timestamp}] ⚠️ ${message}`, getLogStyle('warn'));
  formatLog(data);
};
