import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { authConfig } from "@/auth.config";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validation/auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
    ...authConfig,
    providers: [
        Credentials({
            // On reste sur des credentials email + mot de passe.
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Mot de passe", type: "password" },
            },

            async authorize(credentials) {
                // 1. Valide la forme des entrées (ne jamais faire confiance au client).
                const parsed = loginSchema.safeParse(credentials);
                if (!parsed.success) return null;

                const { email, password } = parsed.data;

                // 2. Recherche l'utilisateur par email.
                const user = await db.user.findUnique({
                    where: { email },
                });

                // 3. Pas d'utilisateur, ou compte sans mot de passe (ex. créé via OAuth) :
                //    on exécute quand même un compare pour limiter l'attaque par timing.
                if (!user?.password) {
                    await bcrypt.compare(
                        password,
                        "$2a$12$invalidinvalidinvalidinvalidinvalidinvalidinvalidinv",
                    );
                    return null;
                }

                // 4. Vérifie le mot de passe.
                const valid = await bcrypt.compare(password, user.password);
                if (!valid) return null;

                // 5. Retourne uniquement les champs nécessaires (jamais le hash).
                return {
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    onboarded: user.onboarded,
                };
            },
        }),
    ],
});
