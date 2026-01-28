import { z } from 'zod';

export const FloodReportSchema = z.object({
  location: z.string().min(1, { message: "Location is required." }),
  latitude: z.number().min(-90).max(90, { message: "Invalid latitude." }),
  longitude: z.number().min(-180).max(180, { message: "Invalid longitude." }),
  water_level: z.enum([
    'ankle',
    'knee',
    'thigh',
    'waist',
    'above_waist',
  ], { message: "Please select a water level." }),
  description: z.string().max(500, { message: "Description must be 500 characters or less." }).optional(),
  reporter_name: z.string().max(100, { message: "Reporter name must be 100 characters or less." }).optional(),
  reporter_contact: z.string().max(100, { message: "Reporter contact must be 100 characters or less." }).optional().refine((val) => {
    if (!val) return true; // Optional, so no validation if empty
    // Basic email or phone number validation (can be improved)
    const isEmail = val.includes('@');
    if (isEmail) {
      return z.string().email({ message: "Invalid email format." }).safeParse(val).success;
    }
    // Simple phone number check (digits and optional +)
    return /^\+?[0-9\s\-()]{7,20}$/.test(val);
  }, { message: "Invalid contact format (email or phone number)." }),
  // photo_url will be handled separately as it's a file upload, not directly in form data
});

export type FloodReportInput = z.infer<typeof FloodReportSchema>;
