await prisma.user.update({
    where: { email: session.user.email },
    data: {
        name: name.trim(),
        currency,
        locale,
        incomeRange,
        savingsGoal: savingsGoal ? parseFloat(savingsGoal) : null,
        onboarded: true,
    },
});
