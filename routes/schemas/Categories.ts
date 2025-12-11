import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  image: z.string().min(1, { message: "Image is required" }),
});

export type CategoryFormData = z.infer<typeof categorySchema>;

export function validate(body: CategoryFormData) {
  return categorySchema.safeParse(body);
}
