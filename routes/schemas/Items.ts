// backend/schemas/itemSchema.ts
import { z } from "zod";

// Detta är samma schema som frontend använder
export const itemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  categoryId: z.string({ error: "Category is required" }),
  attributes: z.object({
    author: z.string().optional(),
    nbrPages: z.number().optional(),
    runTimeMinutes: z.number().optional(),
  }),
});

// Typen kan användas i backend eller frontend
export type ItemForm = z.infer<typeof itemSchema>;

// Funktion för att validera data mot schemat
export function validateItem(body: any) {
  return itemSchema.safeParse(body);
}
