import { z } from 'zod'

export const eventFormSchema = z.object({
    name: z.string().min(1, "Required"),
    description: z.string().optional(),
    isActive: z.boolean().default(true),
    durationInMinutes: z.coerce
    .number()
    .int()
    .positive("Duration must be greater than 0")
    .max(60*12, "Duration must be less then 12 hours"),
})