import { getDictionary } from "@/lib/i18n/dictionaries";
import BudgetForm from "@/components/forms/BudgetForm";
import {
    getBudgetPeriods,
    getPreviousMonthDefaults,
} from "@/services/budgetService";

export default async function NewBudgetPage({
    params,
}: {
    params: Promise<{ lang: "fr" | "en" }>;
}) {
    const { lang } = await params;
    const dict = await getDictionary(lang);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    const period = `${year}-${String(month).padStart(2, "0")}`;

    const [defaultValues, existingPeriods] = await Promise.all([
        getPreviousMonthDefaults(month, year),
        getBudgetPeriods(),
    ]);

    return (
        <div>
            <BudgetForm
                dict={dict}
                lang={lang}
                period={period}
                defaultValues={defaultValues}
                existingPeriods={existingPeriods}
            />
        </div>
    );
}
