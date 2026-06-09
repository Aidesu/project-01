import { getDictionary } from "@/lib/i18n/dictionaries";
import { getCurrentUser } from "@/lib/dal";
import ProfileForm from "@/components/account/ProfileForm";
import PasswordForm from "@/components/account/PasswordForm";
import { logout } from "@/app/actions/auth";

export default async function AccountPage({
    params,
}: {
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const [dict, user] = await Promise.all([getDictionary(lang), getCurrentUser()]);

    if (!user) return null;

    const a = dict.account;

    function getInitials(name: string | null, email: string | null): string {
        if (name) {
            const p = name.trim().split(/\s+/);
            if (p.length >= 2) return (p[0][0] + p[1][0]).toUpperCase();
            return name.slice(0, 2).toUpperCase();
        }
        if (email) return email.slice(0, 2).toUpperCase();
        return "??";
    }

    const initials = getInitials(user.name, user.email);

    return (
        <div className="max-w-3xl mx-auto space-y-5 pb-12">
            {/* ── Header de page ───────────────────────────────────── */}
            <div className="mb-2">
                <h1 className="text-2xl font-bold text-white">{a.title}</h1>
            </div>

            {/* ── Card : profil visuel ──────────────────────────────── */}
            <div className="flex items-center gap-4 bg-[#0d0d11] border border-zinc-800/80 rounded-xl px-5 py-4">
                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-purple-900 flex items-center justify-center text-white text-lg font-bold border-2 border-purple-500/30 flex-shrink-0">
                    {initials}
                </div>
                <div className="min-w-0">
                    <p className="text-base font-semibold text-white truncate">
                        {user.name ?? user.email?.split("@")[0]}
                    </p>
                    <p className="text-sm text-zinc-500 truncate">{user.email}</p>
                </div>
                {/* Badge statut */}
                <div className="ml-auto flex-shrink-0">
                    <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/8 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        {dict.sideBar?.connected}
                    </span>
                </div>
            </div>

            {/* ── Card : informations + préférences ────────────────── */}
            <div className="bg-[#0d0d11] border border-zinc-800/80 rounded-xl overflow-hidden">
                {/* Ligne d'accent violet */}
                <div
                    className="h-[2px]"
                    style={{ background: "linear-gradient(90deg, #7c3aed99 0%, #a855f722 100%)" }}
                />
                <ProfileForm dict={dict} user={user} />
            </div>

            {/* ── Card : sécurité ──────────────────────────────────── */}
            <div className="bg-[#0d0d11] border border-zinc-800/80 rounded-xl overflow-hidden">
                <div className="px-5 pt-5 pb-1">
                    <h2 className="text-sm font-semibold text-white">{a.security}</h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                        {lang === "fr"
                            ? "Modifiez votre mot de passe de connexion."
                            : lang === "ja"
                              ? "ログインパスワードを変更します。"
                              : "Change your login password."}
                    </p>
                </div>
                <PasswordForm dict={dict} />
            </div>

            {/* ── Card : session / déconnexion ─────────────────────── */}
            <div className="bg-[#0d0d11] border border-zinc-800/80 rounded-xl">
                <div className="flex items-center justify-between px-5 py-4">
                    <div>
                        <p className="text-sm font-semibold text-white">{a.session}</p>
                        <p className="text-xs text-zinc-500 mt-0.5">{a.logoutDescription}</p>
                    </div>
                    <form action={logout}>
                        <button
                            type="submit"
                            className="flex items-center gap-2 rounded-lg border border-red-900/50 bg-red-950/30 px-4 py-2 text-sm font-medium text-red-400 transition hover:border-red-700/50 hover:bg-red-950/50 hover:text-red-300"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                            {a.logout}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
