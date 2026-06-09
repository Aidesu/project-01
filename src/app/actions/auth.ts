"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

import { signIn, signOut } from "@/auth";
import { db } from "@/lib/db";
import { verifySession } from "@/lib/dal";
import {
    changePasswordSchema,
    completeProfileSchema,
    loginSchema,
    registerSchema,
    updateProfileSchema,
} from "@/lib/validation/auth";

const DEFAULT_REDIRECT = "/en";

/** Forme de l'état renvoyé aux formulaires via `useActionState`. */
export type AuthFormState =
    | {
          errors?: Record<string, string[]>;
          message?: string;
          success?: boolean;
      }
    | undefined;

/**
 * Inscription : valide, vérifie l'unicité de l'email, hash le mot de passe,
 * crée l'utilisateur puis le connecte.
 */
export async function register(
    _prevState: AuthFormState,
    formData: FormData,
): Promise<AuthFormState> {
    const parsed = registerSchema.safeParse({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors };
    }

    const { name, email, password } = parsed.data;

    try {
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            // Message volontairement générique sur le champ email.
            return { errors: { email: ["Cet email est déjà utilisé."] } };
        }

        const hashed = await bcrypt.hash(password, 12);

        await db.user.create({
            data: { name, email, password: hashed },
        });

        await signIn("credentials", { email, password, redirect: false });
    } catch (error) {
        if (error instanceof AuthError) {
            return { message: "Compte créé mais connexion impossible. Réessayez." };
        }
        return { message: "Une erreur est survenue. Réessayez." };
    }

    redirect(DEFAULT_REDIRECT);
}

/** Connexion par email + mot de passe. */
export async function login(
    _prevState: AuthFormState,
    formData: FormData,
): Promise<AuthFormState> {
    const parsed = loginSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors };
    }

    try {
        await signIn("credentials", {
            email: parsed.data.email,
            password: parsed.data.password,
            redirect: false,
        });
    } catch (error) {
        if (error instanceof AuthError) {
            // On ne révèle pas si l'email existe : message unique.
            return { message: "Email ou mot de passe incorrect." };
        }
        return { message: "Une erreur est survenue. Réessayez." };
    }

    redirect(DEFAULT_REDIRECT);
}

/** Déconnexion. */
export async function logout() {
    await signOut({ redirectTo: "/login" });
}

/**
 * Complète le profil après inscription (onboarding).
 * Gardée par verifySession : un utilisateur ne peut modifier que son propre profil.
 */
export async function completeProfile(
    _prevState: AuthFormState,
    formData: FormData,
): Promise<AuthFormState> {
    const session = await verifySession();

    const parsed = completeProfileSchema.safeParse({
        name: formData.get("name"),
        currency: formData.get("currency"),
        locale: formData.get("locale"),
        incomeRange: formData.get("incomeRange") ?? undefined,
        savingsGoal: formData.get("savingsGoal") ?? undefined,
    });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors };
    }

    const { name, currency, locale, incomeRange, savingsGoal } = parsed.data;

    try {
        await db.user.update({
            where: { id: session.userId },
            data: {
                name,
                currency,
                locale,
                incomeRange,
                savingsGoal: savingsGoal ?? null,
                onboarded: true,
            },
        });
    } catch {
        return { message: "Impossible de mettre à jour le profil. Réessayez." };
    }

    redirect(`/${locale}`);
}

/** Met à jour les informations et préférences du profil. */
export async function updateProfile(
    _prevState: AuthFormState,
    formData: FormData,
): Promise<AuthFormState> {
    const session = await verifySession();

    const parsed = updateProfileSchema.safeParse({
        name: formData.get("name"),
        currency: formData.get("currency"),
        locale: formData.get("locale"),
        incomeRange: formData.get("incomeRange") ?? undefined,
        savingsGoal: formData.get("savingsGoal") || undefined,
    });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors };
    }

    const { name, currency, locale, incomeRange, savingsGoal } = parsed.data;

    try {
        await db.user.update({
            where: { id: session.userId },
            data: { name, currency, locale, incomeRange: incomeRange ?? null, savingsGoal: savingsGoal ?? null },
        });
    } catch {
        return { message: "Unable to save changes. Please try again." };
    }

    const { revalidatePath } = await import("next/cache");
    revalidatePath(`/${locale}/accounts`);

    // Si la locale a changé, redirige vers la nouvelle URL.
    const prevLocale = formData.get("_prevLocale") as string | null;
    if (prevLocale && prevLocale !== locale) {
        redirect(`/${locale}/accounts`);
    }

    return { success: true };
}

/** Modifie le mot de passe après vérification de l'ancien. */
export async function changePassword(
    _prevState: AuthFormState,
    formData: FormData,
): Promise<AuthFormState> {
    const session = await verifySession();

    const parsed = changePasswordSchema.safeParse({
        currentPassword: formData.get("currentPassword"),
        newPassword: formData.get("newPassword"),
        confirmPassword: formData.get("confirmPassword"),
    });

    if (!parsed.success) {
        return { errors: parsed.error.flatten().fieldErrors };
    }

    const { currentPassword, newPassword } = parsed.data;

    const user = await db.user.findUnique({
        where: { id: session.userId },
        select: { password: true },
    });

    if (!user?.password) {
        return { message: "No password set on this account." };
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
        return { errors: { currentPassword: ["Incorrect password."] } };
    }

    try {
        const hashed = await bcrypt.hash(newPassword, 12);
        await db.user.update({
            where: { id: session.userId },
            data: { password: hashed },
        });
    } catch {
        return { message: "Unable to update password. Please try again." };
    }

    return { success: true };
}
