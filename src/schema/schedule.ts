import { DAYS_OF_WEEK_IN_ORDER } from "@/data/constants";
import { timeToInt } from "@/lib/utils";
import { z } from "zod";

export const scheduleFormSchema = z.object({

    timezone: z.string().min(1, "Required"),
    availabilities: z.array(z.object({

        dayOfWeek: z
        .enum(DAYS_OF_WEEK_IN_ORDER),

        // format for time not : seperates HH from MM, | seperates possibilities
        startTime: z
        .string()
        .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM"
        ),

        endTime: z
        .string()
        .regex(
            /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/,
            "Time must be in the format HH:MM"
        ),
    }))
    .superRefine((availabilities, ctx) => {
        availabilities.forEach((availability, index) => {
            const overlaps = availabilities.some((a, i) => {
                return (
                    // ignore current availability if same
                    i !== index && 
                    // check if day of week is same, if not, no overlap
                    a.dayOfWeek === availability.dayOfWeek &&
                    // check if end time of this availability is after the start time of another availability
                    timeToInt(a.startTime) < timeToInt(availability.endTime) &&
                    // check if start time of this availability before the endtime of another availability
                    timeToInt(a.endTime) > timeToInt(availability.startTime)

                )
            })
            
            // overlaps turn true due to .some()
            if (overlaps) {
                ctx.addIssue({
                    code: "custom",
                    message: "Availability overlaps with another",
                    path: [index]
                })
            }
            
            // general check for end time is after start time
            if (
                timeToInt(availability.startTime) >= timeToInt(availability.endTime)
              ) {
                ctx.addIssue({
                  code: "custom",
                  message: "End time must be after start time",
                  path: [index],
                })
            }
        }) 
    })
})
