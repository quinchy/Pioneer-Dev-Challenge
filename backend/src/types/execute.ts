import type { Request } from "express";

export interface ExecuteRequest extends Request {
  query: {
    message: string;
    code: string;
  };
}
