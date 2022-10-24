export interface CryptoOptions {
  salt: string; // 盐值
  options: AnyRecord;
  whiteParams?: string[]; // 入参白名单
}

export interface AxiosCryptoOptions {
  salt: string; // 盐值
}

export interface Request {
  query?: AnyRecord;
  body?: any;
  method: string;
  url: string;
  headers: AnyRecord;
}
