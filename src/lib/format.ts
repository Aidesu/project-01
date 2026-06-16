/**
 * Helpers de formatage partagés par les composants d'analyse.
 * Utilise la devise de l'utilisateur (User.currency) quand elle est connue.
 */

export function formatCurrency(
    amount: number,
    locale: string = "en-US",
    currency: string = "USD",
): string {
    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            maximumFractionDigits: 0,
        }).format(amount);
    } catch {
        // Devise inconnue en base : on retombe sur un format numérique simple.
        return `${new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(amount)} ${currency}`;
    }
}

/**
 * Prix de marché : décimales adaptées à l'ordre de grandeur
 * (62 717 $ · 291,36 $ · 0,4321 $), contrairement à formatCurrency
 * qui arrondit à l'entier pour les montants de budget.
 */
export function formatPrice(
    amount: number,
    locale: string = "en-US",
    currency: string = "USD",
    /** Cours de change : précision forex (1,0843 $ plutôt que 1,08 $). */
    forex: boolean = false,
): string {
    const digits = forex
        ? Math.abs(amount) >= 20
            ? 2
            : 4
        : Math.abs(amount) >= 1000
          ? 0
          : Math.abs(amount) >= 1
            ? 2
            : Math.abs(amount) >= 0.01
              ? 4
              : 6;
    try {
        return new Intl.NumberFormat(locale, {
            style: "currency",
            currency,
            minimumFractionDigits: digits,
            maximumFractionDigits: digits,
        }).format(amount);
    } catch {
        return `${new Intl.NumberFormat(locale, { maximumFractionDigits: digits }).format(amount)} ${currency}`;
    }
}

/** Nom localisé d'une paire de devises : "Euro / Dollar des États-Unis". */
export function currencyPairName(base: string, quote: string, locale: string = "en-US"): string {
    try {
        const names = new Intl.DisplayNames([locale], { type: "currency" });
        const b = names.of(base);
        const q = names.of(quote);
        if (b && q && b !== base && q !== quote) {
            const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
            return `${cap(b)} / ${cap(q)}`;
        }
    } catch {
        // Code inconnu de l'ICU : on retombe sur les codes ISO.
    }
    return `${base}/${quote}`;
}

/** Notation compacte localisée (1,6 M · 29,3 Md) — volumes, capitalisations. */
export function formatCompact(value: number, locale: string = "en-US"): string {
    return new Intl.NumberFormat(locale, {
        notation: "compact",
        maximumFractionDigits: 1,
    }).format(value);
}

export function formatPercent(value: number, locale: string = "en-US", digits = 0): string {
    return `${new Intl.NumberFormat(locale, {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    }).format(value)}%`;
}

/** Nom du mois localisé (ex: "juin 2026"). */
export function formatPeriod(month: number, year: number, locale: string = "en"): string {
    return new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(
        new Date(year, month - 1, 1),
    );
}

/** Remplace les placeholders {clé} d'un template i18n. */
export function interpolate(template: string, vars: Record<string, string | number>): string {
    return template.replace(/\{(\w+)\}/g, (_, key) =>
        key in vars ? String(vars[key]) : `{${key}}`,
    );
}
