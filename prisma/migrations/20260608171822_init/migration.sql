-- CreateTable
CREATE TABLE "Budget" (
    "id" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_income" DOUBLE PRECISION NOT NULL,
    "total_fixed_expenses" DOUBLE PRECISION NOT NULL,
    "total_variable_expenses" DOUBLE PRECISION NOT NULL,
    "total_savings" DOUBLE PRECISION NOT NULL,
    "remaining" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Budget_pkey" PRIMARY KEY ("id")
);
