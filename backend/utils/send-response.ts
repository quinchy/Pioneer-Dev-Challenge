import type { Response } from "express";

interface BaseResponse {
  success: boolean;
  message: string;
}

interface DataWrapper<Data> {
  data?: Data;
}

interface ErrorWrapper<ErrorShape> {
  error?: ErrorShape;
}

type ApiResponse<Data, ErrorShape> = BaseResponse &
  DataWrapper<Data> &
  ErrorWrapper<ErrorShape>;

export function sendResponse<Data = unknown, ErrorShape = unknown>(
  res: Response,
  statusCode: number,
  success: boolean,
  message: string,
  payload?: { data?: Data; error?: ErrorShape },
) {
  const body: ApiResponse<Data, ErrorShape> = {
    success,
    message,
    ...(payload?.data !== undefined ? { data: payload.data } : {}),
    ...(payload?.error !== undefined ? { error: payload.error } : {}),
  };

  return res.status(statusCode).json(body);
}

