import { z } from "zod";

export const executeQuerySchema = z.object({
  message: z.string().min(1, "Message is required"),
});

export type ExecuteQuery = z.infer<typeof executeQuerySchema>;