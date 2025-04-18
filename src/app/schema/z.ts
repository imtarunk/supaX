"use client";

import { z } from "zod";

export const taskSchema = z.object({
  icon: z.string().min(2).max(50),
  task: z.array(
    z.object({
      type: z.string(),
      content: z.array(
        z.object({
          text: z.string(),
          url: z.string().optional(),
          hashtags: z.string().optional(),
          via: z.string().optional(),
        })
      ),
    })
  ),
  points: z.number(),
});
