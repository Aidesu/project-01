import type { DefaultSession } from "next-auth";

/**
 * Augmente les types Auth.js avec nos champs métier (id, onboarded).
 * Voir https://authjs.dev/getting-started/typescript
 */
declare module "next-auth" {
    interface Session {
        user: {
            id: string;
            onboarded: boolean;
        } & DefaultSession["user"];
    }

    interface User {
        onboarded?: boolean;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id: string;
        onboarded: boolean;
    }
}
