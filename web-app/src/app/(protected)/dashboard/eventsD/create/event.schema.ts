import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().min(2, "Title is too short"),
  description: z.string().optional(),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(2, "Location is required"),

  totalBudget: z.coerce.number().positive("Budget must be > 0"),
  ticketPrice: z.coerce.number().nonnegative("Ticket price must be >= 0"),

  capacity: z.coerce.number().int("Capacity must be an integer").positive(),
});
