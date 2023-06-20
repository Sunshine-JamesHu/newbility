export declare type DatabaseType = 'postgres' | 'mysql' | 'mssql' | string;

export interface DatabaseOptions {
  type: DatabaseType;
  options: any;
}

export interface DatabaseSetting {
  [key: string]: DatabaseOptions;
}

export interface DatabaseOptionsBase {
  address: string;
  port?: number;
  database: string;
  userName: string;
  password: string;
  pool?: {
    max?: number;
    min?: number;
  };
}
