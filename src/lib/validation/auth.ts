import { z } from "zod";

const password = z
    .string()
    .min(8, "Au moins 8 caractères.")
    .regex(/[a-zA-Z]/, "Au moins une lettre.")
    .regex(/[0-9]/, "Au moins un chiffre.")
    .regex(/[^a-zA-Z0-9]/, "Au moins un caractère spécial.");

export const loginSchema = z.object({
    email: z.email("Adresse email invalide.").trim().toLowerCase(),
    password: z.string().min(1, "Mot de passe requis."),
});

export const registerSchema = z.object({
    name: z.string().min(2, "Le nom doit faire au moins 2 caractères.").trim(),
    email: z.email("Adresse email invalide.").trim().toLowerCase(),
    password,
});

export const completeProfileSchema = z.object({
    name: z.string().min(2, "Le nom doit faire au moins 2 caractères.").trim(),
    currency: z.string().min(1).max(8).trim(),
    locale: z.enum(["en", "fr", "ja"]),
    incomeRange: z.string().trim().optional(),
    savingsGoal: z.coerce.number().min(0).optional(),
});

export const CURRENCIES = ["USD", "EUR", "GBP", "JPY", "CAD", "CHF", "AUD"] as const;
export const LOCALES = ["en", "fr", "ja"] as const;

export const updateProfileSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters.").trim(),
    currency: z.enum(CURRENCIES),
    locale: z.enum(LOCALES),
    incomeRange: z.string().optional(),
    savingsGoal: z.coerce.number().min(0).max(9999999).optional(),
});

export const changePasswordSchema = z
    .object({
        currentPassword: z.string().min(1, "Current password required."),
        newPassword: password,
        confirmPassword: z.string(),
    })
    .refine((d) => d.newPassword === d.confirmPassword, {
        message: "Passwords don't match.",
        path: ["confirmPassword"],
    });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CompleteProfileInput = z.infer<typeof completeProfileSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
