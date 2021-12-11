import { Log } from '@uk/log';
import { LoggerService } from '@nestjs/common';

export class PixoldLogger implements LoggerService {
  readonly logger: Log;

  constructor(serviceName: string) {
    this.logger = new Log(serviceName.trim());
  }

  log(message: string) {
    this.logger.info(message);
  }
  error(message: string, trace: string) {
    this.logger.error(message, { trace });
  }
  warn(message: string) {
    this.logger.warn(message);
  }
  debug(message: string) {
    this.logger.debug(message);
  }
  verbose(message: string) {
    this.logger.trace(message);
  }
}
