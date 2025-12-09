import { z } from "zod";

export const itemSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  categoryId: z.string({ error: "Category is required" }),
  type: z.enum(["Book", "DVD", "AudioBook", "ReferenceBook"]),
  attributes: z
    .object({
      author: z.string().optional(),
      nbrPages: z.number().optional(),
      runTimeMinutes: z.number().optional(),
    })
    .optional(),
});

export type ItemForm = z.infer<typeof itemSchema>;

export function validateItem(body: any) {
  const result = itemSchema.safeParse(body);

  if (!result.success) return result;

  const data = result.data;

  if (
    (data.type === "DVD" || data.type === "AudioBook") &&
    !data.attributes?.runTimeMinutes
  ) {
    return {
      success: false,
      error: {
        issues: [{ message: "DVD/AudioBook requires runTimeMinutes" }],
      },
    };
  }

  if (
    (data.type === "Book" || data.type === "ReferenceBook") &&
    (!data.attributes?.author || !data.attributes?.nbrPages)
  ) {
    return {
      success: false,
      error: {
        issues: [
          { message: "Book/ReferenceBook requires author and nbrPages" },
        ],
      },
    };
  }

  return result;
}
