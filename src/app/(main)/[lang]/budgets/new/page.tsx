import { getDictionary } from "@/lib/i18n/dictionaries";
import BudgetForm from "@/components/forms/BudgetForm";

export default async function BudgetsPage({
    params,
}: {
    params: Promise<{ lang: "fr" | "en" }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    return (
        <div>
            <BudgetForm dict={dict} />
        </div>
    );
}
