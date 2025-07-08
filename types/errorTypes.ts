export enum ErrorCode {
  INVALID_THREAD_ID = "INVALID_THREAD_ID",
}

export class AppError extends Error {
  code: ErrorCode;
  status?: number;

  constructor(code: ErrorCode, message: string, status = 400) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
