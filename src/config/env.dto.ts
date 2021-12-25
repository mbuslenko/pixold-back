import {
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

export class EnvDto {
  @IsNumber()
  @IsPositive()
  @IsOptional()
  PORT: number = 3000;

  @IsString()
  @IsIn(['development', 'development_with_coin', 'production'])
  NODE_ENV: 'development' | 'development_with_coin' | 'production';

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASS: string;

  @IsString()
  STELLAR_ISSUER_PUBLIC_KEY: string;

  @IsString()
  STELLAR_ISSUER_SECRET_KEY: string;

  @IsString()
  STELLAR_DISTRIBUTOR_PUBLIC_KEY: string;

  @IsString()
  STELLAR_DISTRIBUTOR_SECRET_KEY: string;

  @IsString()
  STELLAR_USER_PUBLIC_KEY: string;

  @IsString()
  STELLAR_USER_SECRET_KEY: string;

  @IsString()
  GOOGLE_CLIENT_ID: string;

  @IsString()
  GOOGLE_SECRET: string;

  @IsString()
  AUTH_SALT: string;

  @IsString()
  ENCRYPTION_PASSWORD: string;

  @IsString()
  STELLAR_API_URL: string;
}
