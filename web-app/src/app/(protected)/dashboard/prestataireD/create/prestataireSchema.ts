import { z } from "zod";

export const prestataireSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Invalid email"),
    category: z.string().min(1, "Category is required"),
    priceMin: z.coerce.number().min(0, "Min price must be >= 0"),
    priceMax: z.coerce.number().min(0, "Max price must be >= 0"),
    location: z.string().min(2, "Location is required"),
    description: z.string().optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
  })
  .refine((data) => data.priceMax >= data.priceMin, {
    message: "Max price must be >= Min price",
    path: ["priceMax"],
  });
