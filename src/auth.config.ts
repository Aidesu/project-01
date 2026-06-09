import type { NextAuthConfig } from "next-auth";

/**
 * Configuration Auth.js « edge-safe » : aucune dépendance à Prisma ou bcrypt ici.
 * Ce module est importé par le proxy (src/proxy.ts) pour les vérifications de session
 * optimistes (lecture du JWT uniquement, pas d'accès base de données).
 *
 * Le provider Credentials (qui nécessite Prisma + bcrypt) est ajouté dans src/auth.ts.
 */
export const authConfig = {
    pages: {
        signIn: "/login",
    },

    session: {
        // Stratégie JWT obligatoire avec le provider Credentials.
        strategy: "jwt",
    },

    providers: [],

    callbacks: {
        /**
         * Garde optimiste utilisée par le proxy : protège tout sauf les pages publiques.
         * `auth` est null quand l'utilisateur n'est pas connecté.
         */
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const { pathname } = nextUrl;

            const isPublicRoute =
                pathname.startsWith("/login") ||
                pathname.startsWith("/register");

            // Page publique → toujours accessible (la redirection des connectés
            // vers le dashboard est gérée dans le proxy).
            if (isPublicRoute) return true;

            // Toute autre route exige une session.
            return isLoggedIn;
        },

        // Propage l'id utilisateur et le statut d'onboarding dans le token JWT.
        jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.onboarded = (user as { onboarded?: boolean }).onboarded ?? false;
            }
            return token;
        },

        // Expose ces champs côté session (server components, useSession).
        session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.onboarded = token.onboarded as boolean;
            }
            return session;
        },
    },
} satisfies NextAuthConfig;
