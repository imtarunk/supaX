"use client";

import { z } from "zod";

export const taskSchema = z.object({
  icon: z.string().min(2).max(50),
  task: z.string().min(2).max(50),
  points: z.any(),
});
