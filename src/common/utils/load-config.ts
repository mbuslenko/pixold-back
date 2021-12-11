import { plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';
import { Log } from '@uk/log';

const log = new Log('ENV');

type ClassType<T> = {
  new (...args: any[]): T;
};

export function loadConfig<T>(envSchema: ClassType<unknown>): T {
  const object = plainToClass(envSchema, process.env, { enableImplicitConversion: true });

  //@ts-ignore
  const errors = validateSync(object, {
    whitelist: true,
  });

  if (errors.length) {
    for (const error of errors) {
      log.fatal(
        `Config field '${error.property}' has issues`,
        error.constraints,
      );
    }

    process.exit(1);
  }

  return object as any;
}
