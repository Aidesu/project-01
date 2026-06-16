import NextAuth from "next-auth";
import { NextResponse } from "next/server";

import { authConfig } from "@/auth.config";

/**
 * Protection centralisée des routes (anciennement « middleware », renommé `proxy`
 * dans cette version de Next.js).
 *
 * On initialise NextAuth UNIQUEMENT avec authConfig (pas de provider Credentials),
 * pour garder ce bundle léger et edge-safe : ici on ne fait qu'une lecture
 * optimiste du JWT de session, jamais d'accès base de données ni de bcrypt.
 */
const { auth } = NextAuth(authConfig);

const DEFAULT_LOCALE = "en";

/** Pages publiques (landing + légal) : accessibles sans session. */
const PUBLIC_PATHS = new Set(["/", "/about", "/terms"]);

export default auth((req) => {
    const { nextUrl } = req;
    const { pathname } = nextUrl;
    const isLoggedIn = !!req.auth?.user;

    const isAuthPage =
        pathname.startsWith("/login") || pathname.startsWith("/register");

    // Landing, à-propos, conditions : toujours accessibles (la page adapte
    // ses CTA selon l'état de connexion).
    if (PUBLIC_PATHS.has(pathname)) {
        return NextResponse.next();
    }

    // Connecté sur une page d'auth → vers le dashboard.
    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(
                new URL(`/${DEFAULT_LOCALE}`, nextUrl),
            );
        }
        return NextResponse.next();
    }

    // Toute autre route est protégée.
    if (!isLoggedIn) {
        const loginUrl = new URL("/login", nextUrl);
        // Mémorise la destination pour un retour après connexion (optionnel côté login).
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
    }

    return NextResponse.next();
});

export const config = {
    // Exclut les routes API, les assets Next et les fichiers statiques.
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
