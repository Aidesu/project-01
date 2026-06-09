import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { db } from "@/lib/db";

/**
 * Data Access Layer — centralise les vérifications d'autorisation côté serveur.
 *
 * Le proxy (src/proxy.ts) fait une garde « optimiste » sur les routes, mais la
 * vraie ligne de défense est ici : appeler verifySession() avant tout accès à des
 * données sensibles (server components, server actions, route handlers).
 */

/** Vérifie la session ; redirige vers /login si absente. Mémoïsé par rendu React. */
export const verifySession = cache(async () => {
    const session = await auth();

    if (!session?.user?.id) {
        redirect("/login");
    }

    return { isAuth: true as const, userId: session.user.id };
});

/**
 * Renvoie l'utilisateur courant sous forme de DTO restreint (jamais le hash).
 * Retourne null si non connecté (utile pour un affichage conditionnel sans redirect).
 */
export const getCurrentUser = cache(async () => {
    const session = await auth();
    if (!session?.user?.id) return null;

    return db.user.findUnique({
        where: { id: session.user.id },
        select: {
            id: true,
            name: true,
            email: true,
            image: true,
            currency: true,
            locale: true,
            incomeRange: true,
            savingsGoal: true,
            onboarded: true,
        },
    });
});
